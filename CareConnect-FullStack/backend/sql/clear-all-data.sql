-- CareConnect: remove all existing application data.
-- Run this once against the careconnect database if it already contains
-- the old demo records. The backend no longer inserts demo data on startup.

TRUNCATE TABLE test_result, test_order, prescription, medical_record, appointment, app_user RESTART IDENTITY CASCADE;
