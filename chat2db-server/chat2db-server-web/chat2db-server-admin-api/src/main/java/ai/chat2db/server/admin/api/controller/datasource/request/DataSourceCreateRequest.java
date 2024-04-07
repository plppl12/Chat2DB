package ai.chat2db.server.admin.api.controller.datasource.request;

import java.util.List;

import ai.chat2db.spi.config.DriverConfig;
import ai.chat2db.spi.model.KeyValue;
import ai.chat2db.spi.model.SSHInfo;
import ai.chat2db.spi.model.SSLInfo;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

/**
 * @author moji
 * @version ConnectionCreateRequest.java, v 0.1 September 16, 2022 14:23 moji Exp $
 * @date 2022/09/16
 */
@Data
public class DataSourceCreateRequest {

    /**
     * Connection alias
     */
    private String alias;

    /**
     * connection address
     */
    @NotNull
    private String url;

    /**
     * Connect username
     */
    private String user;

    /**
     * password
     */
    @NotNull
    private String password;

    /**
     * Certification type
     */
    private String authenticationType;

    /**
     * Connection Type
     */
    @NotNull
    private String type;

    /**
     * host
     */
    private String host;

    /**
     * port
     */
    private String port;

    /**
     * ssh
     */
    private SSHInfo ssh;

    /**
     * ssh
     */
    private SSLInfo ssl;

    /**
     * sid
     */
    private String sid;

    /**
     * driver
     */
    private String driver;


    /**
     * jdbc version
     */
    private String jdbc;

    /**
     * Extended Information
     */
    private List<KeyValue> extendInfo;

    /**
     * Driver configuration
     */
    private DriverConfig driverConfig;

    /**
     * environment id
     */
    @NotNull
    private Long environmentId;

    /**
     * service name
     */
    private String serviceName;

    /**
     * Service type
     */
    private String serviceType;


}
