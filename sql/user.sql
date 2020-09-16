

use im_test; 

drop table if exists user; 

create table user(
id int not null auto_increment primary key, 
username varchar(50), 
nickname varchar(50), 
avatar varchar(255),
password varchar(50),
im_user_id varchar(100),
im_user_sig varchar(100),
create_at datetime,
update_at datetime
) charset=utf8mb4 engine=innodb; 


