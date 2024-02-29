package ai.chat2db.server.domain.repository.entity;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableField;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import java.io.Serializable;
import java.util.Date;
import lombok.Getter;
import lombok.Setter;

/**
 * <p>
 * table cache
 * </p>
 *
 * @author chat2db
 * @since 2023-10-11
 */
@Getter
@Setter
@TableName("TABLE_CACHE")
public class TableCacheDO implements Serializable {

    private static final long serialVersionUID = 1L;

    /**
     * primary key
     */
    @TableId(value = "ID", type = IdType.AUTO)
    private Long id;

    /**
     * creation time
     */
    private Date gmtCreate;

    /**
     * modified time
     */
    private Date gmtModified;

    /**
     * Data source connection ID
     */
    private Long dataSourceId;

    /**
     * db name
     */
    private String databaseName;

    /**
     * schema name
     */
    private String schemaName;

    /**
     * table name
     */
    private String tableName;

    /**
     * unique index
     */
    @TableField(value = "`key`")
    private String key;

    /**
     * version
     */
    private Long version;

    /**
     * table fields
     */
    private String columns;

    /**
     * Custom extension field json
     */
    private String extendInfo;
}
