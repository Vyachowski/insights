const initDb = async () => {
   const { Client } = await import('pg')

   const { 
      POSTGRES_USER,
      POSTGRES_PASSWORD,
      POSTGRES_HOST,
      POSTGRES_PORT,
      POSTGRES_DB,
   } = process.env;

   const connectionString = `postgres://${POSTGRES_USER}:${POSTGRES_PASSWORD}@${POSTGRES_HOST}:${POSTGRES_PORT}/${POSTGRES_DB}`;
   const client = new Client({ connectionString });
   await client.connect();

   try {
      // Таблица cities
      const createCitiesTableQuery = `
         CREATE TABLE IF NOT EXISTS cities (
               id SERIAL PRIMARY KEY,
               name VARCHAR(255) NOT NULL,
               alt_names JSONB,
               revenue_share NUMERIC(10,8),
               priority VARCHAR(10),
               display_order INT
         );
      `;
      await client.query(createCitiesTableQuery);
      console.log('Таблица cities готова');

      // Таблица calls
      const createCallsTableQuery = `
         CREATE TABLE IF NOT EXISTS calls (
               id SERIAL PRIMARY KEY,
               date_time TIMESTAMP NOT NULL,
               caller_number VARCHAR(20) NOT NULL,
               region VARCHAR(255),
               project VARCHAR(255),
               destination VARCHAR(255),
               duration INTERVAL,
               record_url TEXT,
               comment TEXT,
               call_completed BOOLEAN
         );
      `;
      await client.query(createCallsTableQuery);
      console.log('Таблица calls готова');

      // Таблица ежемесячной метрики
      await client.query(`
         CREATE TABLE IF NOT EXISTS city_monthly_metrics (
               id SERIAL PRIMARY KEY,
               city_id INT NOT NULL REFERENCES cities(id) ON DELETE CASCADE,
               month DATE NOT NULL,
               yandex_users INT DEFAULT 0,
               google_users INT DEFAULT 0,
               visit_duration_yandex_in_sec INT DEFAULT 0,
               visit_duration_google_in_sec INT DEFAULT 0,
               bounce_yandex NUMERIC(5,2) DEFAULT 0,
               bounce_google NUMERIC(5,2) DEFAULT 0,
               leads_yandex INT DEFAULT 0,
               leads_google INT DEFAULT 0,
               UNIQUE(city_id, month)
         );
      `);
      console.log('Таблица city_monthly_metrics готова');

      // Таблица еженедельной прибыли
      await client.query(`
         CREATE TABLE IF NOT EXISTS weekly_revenue (
            id SERIAL PRIMARY KEY,
            city_id INT REFERENCES cities(id) ON DELETE CASCADE,
            week_start DATE NOT NULL,
            revenue NUMERIC(12,2) DEFAULT 0,
            UNIQUE(city_id, week_start)
         );
      `);
   } catch (err) {
      console.error('Ошибка при создании таблиц:', err);
   } finally {
      await client.end();
   }

}

