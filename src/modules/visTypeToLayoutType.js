import {
    LAYOUT_TYPE_DEFAULT,
    LAYOUT_TYPE_PIE,
    LAYOUT_TYPE_YEAR_OVER_YEAR,
    LAYOUT_TYPE_PIVOT_TABLE,
    LAYOUT_TYPE_SCATTER,
} from './layoutTypes.js'
import {
    VIS_TYPE_COLUMN,
    VIS_TYPE_STACKED_COLUMN,
    VIS_TYPE_BAR,
    VIS_TYPE_STACKED_BAR,
    VIS_TYPE_LINE,
    VIS_TYPE_AREA,
    VIS_TYPE_STACKED_AREA,
    VIS_TYPE_PIE,
    VIS_TYPE_RADAR,
    VIS_TYPE_GAUGE,
    VIS_TYPE_YEAR_OVER_YEAR_LINE,
    VIS_TYPE_YEAR_OVER_YEAR_COLUMN,
    VIS_TYPE_SINGLE_VALUE,
    VIS_TYPE_PIVOT_TABLE,
    VIS_TYPE_SCATTER,
} from './visTypes.js'

const visTypeToLayoutType = {
    [VIS_TYPE_COLUMN]: LAYOUT_TYPE_DEFAULT,
    [VIS_TYPE_STACKED_COLUMN]: LAYOUT_TYPE_DEFAULT,
    [VIS_TYPE_BAR]: LAYOUT_TYPE_DEFAULT,
    [VIS_TYPE_STACKED_BAR]: LAYOUT_TYPE_DEFAULT,
    [VIS_TYPE_LINE]: LAYOUT_TYPE_DEFAULT,
    [VIS_TYPE_AREA]: LAYOUT_TYPE_DEFAULT,
    [VIS_TYPE_STACKED_AREA]: LAYOUT_TYPE_DEFAULT,
    [VIS_TYPE_PIE]: LAYOUT_TYPE_PIE,
    [VIS_TYPE_RADAR]: LAYOUT_TYPE_DEFAULT,
    [VIS_TYPE_GAUGE]: LAYOUT_TYPE_PIE,
    [VIS_TYPE_YEAR_OVER_YEAR_LINE]: LAYOUT_TYPE_YEAR_OVER_YEAR,
    [VIS_TYPE_YEAR_OVER_YEAR_COLUMN]: LAYOUT_TYPE_YEAR_OVER_YEAR,
    [VIS_TYPE_SINGLE_VALUE]: LAYOUT_TYPE_PIE,
    [VIS_TYPE_PIVOT_TABLE]: LAYOUT_TYPE_PIVOT_TABLE,
    [VIS_TYPE_SCATTER]: LAYOUT_TYPE_SCATTER,
}

export const getLayoutTypeByVisType = (visType) => visTypeToLayoutType[visType]
