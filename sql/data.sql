-- add day records
INSERT INTO Days (Day) VALUES ('Monday');
INSERT INTO Days (Day) VALUES ('Tuesday');
INSERT INTO Days (Day) VALUES ('Wednesday');
INSERT INTO Days (Day) VALUES ('Thursday');
INSERT INTO Days (Day) VALUES ('Friday');
INSERT INTO Days (Day) VALUES ('Saturday');
INSERT INTO Days (Day) VALUES ('Sunday');

-- add default admin record
INSERT INTO Users (User_Role, User_Name, User_Password) VALUES ('Admin','Manager','P@ssword123');
