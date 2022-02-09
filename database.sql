
create table Userinfo (
    user_id serial primary key,
    user_name varchar(50) not null,
    user_email varchar(50) not null unique, 
    user_phone varchar(12) not null,
    user_dob date not null,
    user_pass char(60) not null
);

create table Record (
    record_id serial primary key,
    record_name varchar(100) not null,
    record_start date not null,
    record_end date not null,
    record_notes varchar(255),
    user_email varchar(50) references Userinfo(user_email) on delete cascade
);
