import pool from "./db";

const birthdayDate = `TO_DATE(birthday, 'FMMonth FMDD, YYYY')`;

// TODAY
export async function getTodaysBirthdays() {
  const result = await pool.query(`
    SELECT *
    FROM people
    WHERE birthday IS NOT NULL
      AND EXTRACT(MONTH FROM ${birthdayDate}) = EXTRACT(MONTH FROM CURRENT_DATE)
      AND EXTRACT(DAY FROM ${birthdayDate}) = EXTRACT(DAY FROM CURRENT_DATE)
    LIMIT 50
  `);

  return result.rows;
}

// YESTERDAY
export async function getYesterdaysBirthdays() {
  const result = await pool.query(`
    SELECT *
    FROM people
    WHERE birthday IS NOT NULL
      AND EXTRACT(MONTH FROM ${birthdayDate}) = EXTRACT(MONTH FROM CURRENT_DATE - INTERVAL '1 day')
      AND EXTRACT(DAY FROM ${birthdayDate}) = EXTRACT(DAY FROM CURRENT_DATE - INTERVAL '1 day')
    LIMIT 50
  `);

  return result.rows;
}

// UPCOMING COUNTS
export async function getUpcomingBirthdayCounts() {
  const result = await pool.query(`
    SELECT
      COUNT(*) FILTER (
        WHERE EXTRACT(MONTH FROM ${birthdayDate}) = EXTRACT(MONTH FROM CURRENT_DATE + INTERVAL '1 day')
        AND EXTRACT(DAY FROM ${birthdayDate}) = EXTRACT(DAY FROM CURRENT_DATE + INTERVAL '1 day')
      ) AS day1,

      COUNT(*) FILTER (
        WHERE EXTRACT(MONTH FROM ${birthdayDate}) = EXTRACT(MONTH FROM CURRENT_DATE + INTERVAL '2 day')
        AND EXTRACT(DAY FROM ${birthdayDate}) = EXTRACT(DAY FROM CURRENT_DATE + INTERVAL '2 day')
      ) AS day2,

      COUNT(*) FILTER (
        WHERE EXTRACT(MONTH FROM ${birthdayDate}) = EXTRACT(MONTH FROM CURRENT_DATE + INTERVAL '3 day')
        AND EXTRACT(DAY FROM ${birthdayDate}) = EXTRACT(DAY FROM CURRENT_DATE + INTERVAL '3 day')
      ) AS day3,

      COUNT(*) FILTER (
        WHERE EXTRACT(MONTH FROM ${birthdayDate}) = EXTRACT(MONTH FROM CURRENT_DATE + INTERVAL '4 day')
        AND EXTRACT(DAY FROM ${birthdayDate}) = EXTRACT(DAY FROM CURRENT_DATE + INTERVAL '4 day')
      ) AS day4

    FROM people
    WHERE birthday IS NOT NULL
  `);

  const row = result.rows[0];

  return [
    { label: "Day 1", count: row.day1 },
    { label: "Day 2", count: row.day2 },
    { label: "Day 3", count: row.day3 },
    { label: "Day 4", count: row.day4 },
  ];
}

// SAME DATE
export async function getProfilesByExactDate(date: string) {
  const result = await pool.query(`
    SELECT *
    FROM people
    WHERE birthday = $1
    LIMIT 50
  `, [date]);

  return result.rows;
}