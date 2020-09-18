use im_test;

update user set user.nickname = (
	select username from (
		select * from user
    ) as u where u.id = user.id
) where id >= 12;

select * from user; 