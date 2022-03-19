import {Connection, Model, Schema, Document} from 'mongoose';
import {IKeyValue} from "../../core/CpcInterface";
import {BaseDb} from "../BaseDb";

const _tableSchema: IKeyValue = {
    properties: Object,
    geometry: {
        type: {
            type: String,
            default: "Point"
        },
        coordinates: {
            type: [Number],
            index: "2dsphere"
        }
    }
};

export class Geojson extends BaseDb {

    constructor(tableName: string) {
        super(tableName, _tableSchema);
    }

    /**
     * 指定地理空间查询从最近到最远返回文档的点。使用球面几何计算距离 。
     * @param {number[]} coordinates 经纬度 [119.309968,26.052552]
     * @param {number} maxDistance 最大距离
     * @param {number} minDistance 最小距离
     * @returns {any}
     */
    public nearSphereByPoint(coordinates: number[], maxDistance: number, minDistance: number = 0) {
        return this.model.find({
            "geometry.coordinates":
                {
                    $nearSphere: {
                        $geometry: {
                            type: "Point",
                            coordinates: coordinates
                        },
                        $minDistance: minDistance,
                        $maxDistance: maxDistance
                    }
                }
        })
    }

    /**
     * 指定地理空间查询从最近到最远返回文档的点。$near可以指定GeoJSON点或旧坐标点。
     * @param {number[]} coordinates 经纬度 [119.309968,26.052552]
     * @param {number} maxDistance 最大距离
     * @param {number} minDistance 最小距离
     * @returns {any}
     */
    public nearByPoint(coordinates: number[], maxDistance: number, minDistance: number = 0) {
        return this.model.find({
            "geometry.coordinates":
                {
                    $near: {
                        $geometry: {
                            type: "Point",
                            coordinates: coordinates
                        },
                        $minDistance: minDistance,
                        $maxDistance: maxDistance
                    }
                }
        })
    }

    /**
     *查询面包含的文档点
     * @param {number[][][]} coordinates [[
     [119.309968,26.052552],
     [119.318731,26.05206],
     [119.317114,26.045394],
     [119.309603,26.046074],
     [119.309968,26.052552]
     ]]
     * @returns {any}
     */
    public geoWithinByPolygon(coordinates: number[][][]) {
        return this.model.find({
            "geometry.coordinates":
                {
                    $geoWithin:
                        {
                            $geometry:
                                {
                                    type: "Polygon",
                                    coordinates: coordinates
                                }
                        }
                }
        })
    }

    /**
     * 根据包围盒查询文档点
     * @param {number[][]} box 包围盒
     */
    public geoWithinByBox(box: number[][]) {
        this.model.find({
            "geometry.coordinates": {$geoWithin: {$box: box}}
        })
    }

    /**
     * 使用球面几何的地理空间查询定义一个圆。该查询返回圆圈范围内的文档。
     * @param {number[]} coordinates [119.309968,26.052552] 坐标
     * @param {number} radius 单位：弧度，经纬度的话：米/6378.1  例如500米：0.5/6378.1
     * @returns {any}
     */
    public geoWithinByCenterSphere(coordinates: number[], radius: number) {
        return this.model.find(
            {
                "geometry.coordinates": {
                    $geoWithin: {
                        $centerSphere: [coordinates, radius]
                    }
                }
            }
        )
    }
}
