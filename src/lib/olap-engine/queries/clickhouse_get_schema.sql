WITH
    raw AS (
        SELECT
            t.name AS name,
            IF(t.as_select LIKE '%s3(%', 'S3', t.engine) AS engine,
            groupArray(map('name', c.name, 'type', c.type)) AS columns,
            any(comment) as comment
        FROM system.tables AS t
        LEFT JOIN system.columns AS c
        ON t.name = c.table
        WHERE database = currentDatabase()
        GROUP BY name, engine
        ORDER BY name
    )

SELECT
    name,
    engine,
    IF(
        length(columns) > 0 and length(raw.columns[1]['name']) > 0,
        columns,
        JSONExtract(comment, 'columns', 'Array(Map(String,String))')
    ) as columns,
    JSONExtractString(comment, 'short') as short,
    JSONExtractString(comment, 'url') as url,
    JSONExtractString(comment, 'usage') as usage
FROM raw
