package ai.chat2db.server.domain.api.chart;

import ai.chat2db.server.tools.base.wrapper.param.PageQueryParam;

import lombok.Data;

/**
 * @author moji
 * @version UserSavedDdlPageQueryParam.java, v 0.1 September 25, 2022 14:05 moji Exp $
 * @date 2022/09/25
 */
@Data
public class ChartPageQueryParam extends PageQueryParam {

    /**
     * Report ID
     */
    private Long dashboardId;

    /**
     * search keyword
     */
    private String searchKey;

}
