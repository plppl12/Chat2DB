package ai.chat2db.server.domain.api.param.team;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;

/**
 * select
 *
 * @author Jiaju Zhuang
 */
@Data
@SuperBuilder
@NoArgsConstructor
@AllArgsConstructor
public class TeamSelector {
    /**
     * Modifier user
     */
    private Boolean modifiedUser;

}
