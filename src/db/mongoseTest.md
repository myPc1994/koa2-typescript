##目录
```
   1. $exists判断字段是否存在
   2.大小比较操作符
   3.$all匹配所有
   4.Null空值处理
   5.$mod取模运算(取余数)
   6.$ne不等于
   7.$in包含
   8.$nin 不包含
   9.$size数组元素个数
   10.$regex正则表达式匹配
   11.javascript查询和$where查询
   12.count查询记录条数
```
### 条件操作符
>http://cw.hubwiz.com/card/c/543b2f3cf86387171814c026/1/2/1/
1. $exists判断字段是否存在
```
    查询所有存在age 字段的记录 <br>
        db.users.find({age: {$exists: true}});<br>
    查询所有不存在name 字段的记录<br>
        db.users.find({name: {$exists: false}});
```
2.大小比较操作符
><, <=, >, >= 这个操作符就不用多解释了，最常用也是最简单的。
```
        db.collection.find({ "field" : { $gt: value } } ); // 大于: field > value
        db.collection.find({ "field" : { $lt: value } } ); // 小于: field < value
        db.collection.find({ "field" : { $gte: value } } ); // 大于等于: field >= value
        db.collection.find({ "field" : { $lte: value } } ); // 小于等于: field <= value
    如果要同时满足多个条件，可以这样做
        db.collection.find({ "field" : { $gt: value1, $lt: value2 } } ); // value1 < field < value2
```
3.$all匹配所有
> 这个操作符跟SQL 语法的in 类似，但不同的是, in 只需满足( )内的某一个值即可, 而$all 必须满足[ ]内的所有值，例如:
```
        db.users.find({age : {$all : [6, 8]}});
    可以查询出：
        {name: 'David', age: 26, age: [ 6, 8, 9 ] }
    但查询不出：
        {name: 'David', age: 26, age: [ 6, 7, 9 ] }

```
4.Null空值处理
```
Null空值的处理稍微有一点奇怪，具体看下面的样例数据：
        > db.c2.find()
        { "_id" : ObjectId("4fc34bb81d8a39f01cc17ef4"), "name" : "Lily", "age" : null }
        { "_id" : ObjectId("4fc34be01d8a39f01cc17ef5"), "name" : "Jacky", "age" : 23 }
        { "_id" : ObjectId("4fc34c1e1d8a39f01cc17ef6"), "name" : "Tom", "addr" : 23 }
其中”Lily”的age 字段为空，Tom 没有age 字段，我们想找到age 为空的行，具体如下：

        > db.c2.find({age:null})
        { "_id" : ObjectId("4fc34bb81d8a39f01cc17ef4"), "name" : "Lily", "age" : null }
        { "_id" : ObjectId("4fc34c1e1d8a39f01cc17ef6"), "name" : "Tom", "addr" : 23 }
奇怪的是我们以为只能找到”Lily”，但”Tom”也被找出来了，因为”null”不仅会匹配某个键的值为null的文档， 而且还会匹配不包含这个键的文档 。那么怎么样才能只找到”Lily”呢?我们用exists 来限制一下即可.
在users文档找出"sex"值为"null"并且字段存在的记录。
        > db.users.find({sex:{"$in":[null], "$exists":true}});
```
5.$mod取模运算(取余数)
```
查询age 取模10 等于0 的数据
        db.student.find( { age: { $mod : [ 10 , 0 ] } } )
举例如下:
C1 表的数据如下:
        db.c1.find()
        { "_id" : ObjectId("4fb4af85afa87dc1bed94330"), "age" : 7, "length_1" : 30 }
        { "_id" : ObjectId("4fb4af89afa87dc1bed94331"), "age" : 8, "length_1" : 30 }
        { "_id" : ObjectId("4fb4af8cafa87dc1bed94332"), "age" : 6, "length_1" : 30 }
查询age 取模6 等于1 的数据
        > db.c1.find({age: {$mod : [ 6 , 1 ] } })
        { "_id" : ObjectId("4fb4af85afa87dc1bed94330"), "age" : 7, "length_1" : 30 }
可以看出只显示出了age 取模6 等于1 的数据，其它不符合规则的数据并没有显示出来
在users文档中查询"age"取模5 等于1的数据。
        > db.users.find({age:{$mod:[5,1]}});
```
6.$ne不等于
```
  查询x 的值不等于3 的数据
      db.things.find( { x : { $ne : 3 } } );
  举例如下:
  C1 表的数据如下:
      > db.c1.find()
      { "_id" : ObjectId("4fb4af85afa87dc1bed94330"), "age" : 7, "length_1" : 30 }
      { "_id" : ObjectId("4fb4af89afa87dc1bed94331"), "age" : 8, "length_1" : 30 }
      { "_id" : ObjectId("4fb4af8cafa87dc1bed94332"), "age" : 6, "length_1" : 30 }
  查询age 的值不等于7 的数据
      > db.c1.find( { age : { $ne : 7 } } );
      { "_id" : ObjectId("4fb4af89afa87dc1bed94331"), "age" : 8, "length_1" : 30 }
      { "_id" : ObjectId("4fb4af8cafa87dc1bed94332"), "age" : 6, "length_1" : 30 }
  可以看出只显示出了age 不等于7 的数据，其它不符合规则的数据并没有显示出来
  在users文档中查询"age"不等于20的记录：
        db.users.find({age:{$ne:20}});
  ```
  
7.$in包含
```
与sql 标准语法的用途是一样的，即要查询的是一系列枚举值的范围内

查询x 的值在2,4,6 范围内的数据：

db.things.find({x:{$in: [2,4,6]}});
举例如下:

C1 表的数据如下:

> db.c1.find()
{ "_id" : ObjectId("4fb4af85afa87dc1bed94330"), "age" : 7, "length_1" : 30 }
{ "_id" : ObjectId("4fb4af89afa87dc1bed94331"), "age" : 8, "length_1" : 30 }
{ "_id" : ObjectId("4fb4af8cafa87dc1bed94332"), "age" : 6, "length_1" : 30 }
查询age 的值在7,8 范围内的数据

> db.c1.find({age:{$in: [7,8]}});
{ "_id" : ObjectId("4fb4af85afa87dc1bed94330"), "age" : 7, "length_1" : 30 }
{ "_id" : ObjectId("4fb4af89afa87dc1bed94331"), "age" : 8, "length_1" : 30 }
可以看出只显示出了age 等于7 或8 的数据，其它不符合规则的数据并没有显示出来

$in非常灵活，可以指定不同类型的条件和值。

在users文档查询"age"等于11或26的记录：

db.users.find({age:{$in:[11,26]}});

```
8.$nin 不包含
```
  与sql 标准语法的用途是一样的，即要查询的数据在一系列枚举值的范围外
  
  查询x 的值在2,4,6 范围外的数据：
  
  db.things.find({x:{$nin: [2,4,6]}});
  举例如下:
  
  C1 表的数据如下:
  
  > db.c1.find()
  { "_id" : ObjectId("4fb4af85afa87dc1bed94330"), "age" : 7, "length_1" : 30 }
  { "_id" : ObjectId("4fb4af89afa87dc1bed94331"), "age" : 8, "length_1" : 30 }
  { "_id" : ObjectId("4fb4af8cafa87dc1bed94332"), "age" : 6, "length_1" : 30 }
  查询age 的值在7,8 范围外的数据
  
  > db.c1.find({age:{$nin: [7,8]}});
  { "_id" : ObjectId("4fb4af8cafa87dc1bed94332"), "age" : 6, "length_1" : 30 }
  可以看出只显示出了age 不等于7 或8 的数据，其它不符合规则的数据并没有显示出来
  
  在users文档中查询"age"不等于18或者20的记录：
  
  db.users.find({age:{$nin:[18,20]}});
```
9.$size数组元素个数
```
$size对于查询数组来说是非常有用的，顾名思义，可以用它查询特定长度的数组。例如：

> db.users.find({favorite_number: {$size: 3}})
对于记录

{name: 'David', age: 26, favorite_number: [ 6, 7, 9 ] }
匹配的查询：

db.users.find({favorite_number: {$size: 3}});
不匹配的查询：

db.users.find({favorite_number: {$size: 2}});
得到一个长度范围内的文档是一种常见的查询。$size并不能与其他查询条件（比如$gt） 组合使用，但是这种查询可以通过在文档中添加一个"size"键的方式来实现。这样每一次向 指定数组添加元素时，同时增加"size"的值。比如，原来这样的更新：

> db.users.update(criteria,{"$push":{"favorite_number":"1"}})
就要变成下面这样：

> db.users.update(criteria,{"$push":{"favorite_number":"1"},"$inc":{"$size":1}})
自增操作的速度非常快，所以对性能的影响微乎其微。这样存储文档后，就可以像下面这样查询了：

> db.users.find({"$size":{"$gt":3}})
很遗憾，这种技巧并不能与"$addToSet"操作符同时使用。
```

10.$regex正则表达式匹配
```
查询name字段以B开头的记录

db.users.find({name: {$regex: /^B.*/}});
举例如下:

C1 表的数据如下:

> db.c1.find();
{ "_id" : ObjectId("4fb5faaf6d0f9d8ea3fc91a8"), "name" : "Tony", "age" : 20 }
{ "_id" : ObjectId("4fb5fab96d0f9d8ea3fc91a9"), "name" : "Joe", "age" : 10 }
查询name 以T 开头的数据

> db.users.find({name: {$regex: /^T.*/}});
```

11.javascript查询和$where查询
```
查询a 大于3 的数据，下面的查询方法殊途同归

>db.c1.find( { a : { $gt: 3 } } );

>db.c1.find( { $where: "this.a > 3" } );

>db.c1.find("this.a > 3");

>f = function() { return this.a > 3; } db.c1.find(f);
查询users文档中年龄大于20的记录

f = function() { return this.age > 20; }; db.users.find(f);
```

12.count查询记录条数
```
使用count()方法查询表中的记录条数，例如，下面的命令查询表users的记录数量：

db.users.find().count();
当使用limit()方法限制返回的记录数时，默认情况下count()方法仍然返回全部记录条数。 例如，下面的示例中返回的不是5，而是user表中所有的记录数量：

db.users.find().skip(10).limit(5).count();
如果希望返回限制之后的记录数量，要使用count(true)或者count(非0)：

db.users.find().skip(10).limit(5).count(true);
假设C1 表的数据如下:

> db.c1.find()
{ "_id" : ObjectId("4fb5faaf6d0f9d8ea3fc91a8"), "name" : "Tony", "age" : 20 }
{ "_id" : ObjectId("4fb5fab96d0f9d8ea3fc91a9"), "name" : "Joe", "age" : 10 }
那么执行以下命令就可以查询c1 表的数据量

> db.c1.count()
2
可以看出表中共有2 条数据。
```