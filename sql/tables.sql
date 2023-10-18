CREATE TABLE Users (ID serial not null primary key,User_Role text, User_Name text, User_Password text);
CREATE TABLE Days (ID serial not null primary key, Day text);
CREATE TABLE Schedule (ID serial not null primary key, Weekday text, FK_Waiter_ID int,FK_Day_ID int);

--* DATATYPES
/*
?   NUMERIC
*Name           |   Storage Size    |   Description	                    |   Range
smallint        |   2 bytes	        |   small-range integer	            |   -32768 to +32767
integer         |   4 bytes	        |   typical choice for integer	    |   -2147483648 to +2147483647
bigint          |   8 bytes	        |   large-range integer	            |   -9223372036854775808 to +9223372036854775807
decimal         |   variable	    |   user-specified precision, exact	|   up to 131072 digits before the decimal point; up to 16383 digits after the decimal point
numeric         |   variable        |	user-specified precision, exact	|   up to 131072 digits before the decimal point; up to 16383 digits after the decimal point
real            |   4 bytes	        |   variable-precision, inexact     |   6 decimal digits precision
double precision|	8 bytes	        |   variable-precision, inexact     |   15 decimal digits precision
smallserial     |	2 bytes	        |   small autoincrementing integer	|   1 to 32767
serial	        |   4 bytes	        |   autoincrementing integer	    |   1 to 2147483647
bigserial	    |   8 bytes	        |   large autoincrementing integer  |   1 to 9223372036854775807
money           |   8 bytes         |   currency ammount                |   -92233720368547758.08 to +92233720368547758.07
?---------------------------------------------------------------------------------------------------------------------------------------------
?   TEXT
*Name                               |   Description                     |
varchar(n)                          |   variable-length with limit      |   
char(n)                             |   fixed-length,blank padded       |
text                                |   variable unlimited length       |
?---------------------------------------------------------------------------------------------------------------------------------------------
?   DATE AND TIME
*Name	                                |   Storage Size|   Description                           | Range	                            |   Resolution
timestamp [ (p) ] [ without time zone ]	|   8 bytes	    |   both date and time (no time zone)	  | 4713 BC	to 294276 AD	            |   1 microsecond
timestamp [ (p) ] with time zone	    |   8 bytes	    |   both date and time, with time zone	  | 4713 BC	to 294276 AD	            |   1 microsecond
date	                                |   4 bytes	    |   date (no time of day)	              | 4713 BC	to 5874897 AD	            |   1 day
time [ (p) ] [ without time zone ]	    |   8 bytes	    |   time of day (no date)	              | 00:00:00 to	24:00:00	            |   1 microsecond
time [ (p) ] with time zone	            |   12 bytes	|   time of day (no date), with time zone | 00:00:00+1559 to 24:00:00-1559      |   1 microsecond
interval [ fields ] [ (p) ]	            |   16 bytes	|   time interval	                      | -178000000 years to 178000000 years	|   1 microsecond
?----------------------------------------------------------------------------------------------------------------------------------------------
?   BOOLEAN
*Name           |   Storage Size    |   Description	                    |
boolean         |   1 byte          |   state of true or false          |

*/