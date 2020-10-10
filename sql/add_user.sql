REVOKE ALL PRIVILEGES, GRANT OPTION
    FROM IM_ROOT@'%';
    
DROP USER IF EXISTS IM_ROOT@'%';

DROP DATABASE IF EXISTS im_messaging;

create database im_messaging; 


CREATE USER 'IM_ROOT'@'%' identified BY "iM_ROOT_123";
grant ALL ON im_messaging.* to 'IM_ROOT'@'%';

flush privileges;
