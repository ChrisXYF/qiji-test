const db = require("../db/index");

exports.getAllPartner = (req, res) => {
  const sql = `select * from partners`;
  db.query(sql, (err, results) => {
    if (err) return res.output(err);
    res.output("查询成功", 0, results);
  });
};

exports.getListByPartner = (req, res) => {
  const { partner_id, date } = req.query;
  const sql = `select * from available_times where partner_id  = ${partner_id} and datetime = '${date}'`;
  db.query(sql, (err, results) => {
    console.log(err);
    if (err) return res.output(err);
    res.output("查询成功", 0, results);
  });
};

exports.getAppointmentList = (req, res) => {
  const { entrepreneur_id, partner_id, datetime } = req.body;

  const query = `
    SELECT 
        at.time_id,
        at.datetime,
        at.start_time,
        at.status AS availability_status,
        CASE 
            WHEN ap.appointment_id IS NOT NULL THEN 'Yes'
            ELSE 'No'
        END AS hasBook
    FROM 
        available_times at
    LEFT JOIN 
        appointments ap ON at.time_id = ap.time_id AND ap.entrepreneur_id = '${entrepreneur_id}'
    WHERE 
        at.partner_id = '${partner_id}' AND at.datetime = '${datetime}'
    ORDER BY 
        at.start_time;
  `;

  db.query(query, [entrepreneur_id, partner_id, datetime], (error, results) => {
    if (error) {
      return res.output({ message: "Error accessing the database", error });
    }
    res.output("查询成功", 0, results);
  });
};

exports.checkInterviewToday = async (req, res) => {
  const { entrepreneur_id, partner_id, datetime } = req.query;

  try {
    const today = new Date().toISOString().slice(0, 10);
    const sql = `SELECT EXISTS (
      SELECT 1 FROM interviews
      WHERE entrepreneur_id = '${entrepreneur_id}' AND partner_id = ${partner_id} AND date = '${datetime}'
    ) AS interview_exists;`;

    const [results] = await db
      .promise()
      .query(sql, [entrepreneur_id, partner_id, today]);
    const exists = results[0].interview_exists;
    res.output("查询成功", 0, { interviewExists: !!exists });
  } catch (err) {
    return res.output({ message: "Error accessing the database", error });
  }
};

exports.toHaveAppointment = (req, res) => {
  const { timeId, partner_id, entrepreneur_id, datetime, start_time, status } =
    req.body;

  db.beginTransaction((err) => {
    if (err) {
      return res.output({ error: "Transaction failed", details: err });
    }

    const insertQuery = `INSERT INTO appointments (time_id, partner_id, entrepreneur_id, datetime, start_time, status) VALUES (${timeId}, '${partner_id}', '${entrepreneur_id}', '${datetime}', '${start_time}', '${status}')`;

    db.query(
      insertQuery,
      [timeId, partner_id, entrepreneur_id, datetime, start_time, status],
      (error, results) => {
        if (error) {
          return db.rollback(() => {
            res.output({ error: "Failed to book appointment", details: error });
          });
        }
        const updateQuery = `UPDATE available_times SET status = '${status}' WHERE time_id = '${timeId}'`;

        db.query(updateQuery, (error, results) => {
          if (error) {
            return db.rollback(() => {
              res.status(500).send({
                error: "Failed to update available times",
                details: error,
              });
            });
          }

          db.commit((err) => {
            if (err) {
              return db.rollback(() => {
                res.output({
                  error: "Failed to commit transaction",
                  details: err,
                });
              });
            }
            res.output("查询成功", 0, results);
          });
        });
      }
    );
  });
};

exports.updatePartnerStatus = async (req, res) => {
  const { status, partner_id, datetime, start_time } = req.body;

  try {
    const sqlCheck = `SELECT EXISTS (
      SELECT 1 FROM available_times
      WHERE partner_id = ${partner_id} AND datetime = ${datetime} AND start_time = ${start_time}?
    ) AS record_exists;`;

    const checkResults = await db
      .promise()
      .query(sqlCheck, [partner_id, datetime, start_time]);
    if (checkResults[0][0]["record_exists"] == 1) {
      const sqlUpdate = `UPDATE available_times
        SET status = '${status}'
        WHERE partner_id = '${partner_id}'
          AND datetime = '${datetime}'
          AND start_time = '${start_time}'`;
      await db
        .promise()
        .query(sqlUpdate, [status, partner_id, datetime, start_time]);
      res.output("执行成功!", 0, checkResults[0]);
    } else {
      const sqlInsert = `INSERT INTO available_times (partner_id, datetime, start_time, status)
        VALUES ('${partner_id}', '${datetime}', '${start_time}', '${start_time}');`;
      await db
        .promise()
        .query(sqlInsert, [partner_id, datetime, start_time, status]);
      res.output("执行成功!", 0, checkResults[0]);
    }
  } catch (err) {
    return res.output(err);
  }
};
