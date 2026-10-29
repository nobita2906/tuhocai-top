import pymysql

conn = pymysql.connect(
    host='103.127.195.56',
    user='postgress_user',
    password='Nvdang@1',
    database='tuhocai_top',
    port=3306
)
cur = conn.cursor()
cur.execute("""
    INSERT INTO site_settings (skey, svalue) 
    VALUES ('bank_id', 'ACB'), ('account_no', '4747827'), ('account_name', 'NGUYEN VAN DANG')
    ON DUPLICATE KEY UPDATE svalue = VALUES(svalue)
""")
conn.commit()
print("Database site_settings updated successfully!")
cur.execute("SELECT * FROM site_settings")
print("Rows:", cur.fetchall())
conn.close()
