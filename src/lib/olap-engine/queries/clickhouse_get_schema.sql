SELECT
    t.name AS name,
    IF(t.as_select LIKE '%s3(%', 'S3', t.engine) AS engine,
    groupArray(map('name', c.name, 'type', c.type)) AS columns
FROM system.tables AS t
INNER JOIN system.columns AS c 
    ON t.name = c.table
WHERE database = currentDatabase()
GROUP BY name, engine
