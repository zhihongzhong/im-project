

use im_test; 

drop table if exists user; 

create table user(
id int not null auto_increment primary key, 
username varchar(50), 
nickname varchar(50), 
avatar varchar(255),
password varchar(50),
create_at datetime,
update_at datetime
) charset=utf8mb4 engine=innodb; 
