/**
 *
 * * IMPORTS
 *
 */

import fs from 'fs';
import csv from 'csv-parser';
import iconv from 'iconv-lite';
import write from 'write';
import { replaceAll } from './util';

/**
 *
 * <> GLOBALS
 *
 */

/**
 *
 * ! BUILDING
 *
 */


function Proccessor(
  { laggards_file_name,
    IS_INSERT_IGNORE,
    csv_file_path,
    encoding,
    fields,
    result_file_name,
    TABLE_NAME,
    PreProcessor,
    PostProcessor
  }: ProcessorSetup
): void {
  let string_file = '';
  let string_file_2 = '';

  ///
  let columns_header, rows_list, columns = [], row_data;
  //
  let current_array_data_result = [];
  //
  let current_array_data_laggard = [];

  fs.createReadStream(csv_file_path)
    .pipe(iconv.decodeStream(encoding))
    .pipe(csv())
    .on('data', (row_) => {
      //
      const row: any = (() => {
        let obj = {};

        //
        Object.keys(row_).forEach((row_raw) => {
          Object.keys(fields).forEach((row_exact) => {
            //
            if (row_exact == row_raw)
              Object.assign(obj, {
                [`${fields[row_exact]}`]: row_[row_raw],
              });
          });
        });

        return obj;
      })();

      let data_sharing = row;
      //
      for (const func of PreProcessor) {
        //
        data_sharing = func(
          data_sharing,
          PushToResult,
          PushToLaggards,
          current_array_data_result
        )
        //
        columns = Object.keys(data_sharing)
      }

    })
    .on('end', () => {
      let recycle = {}
      let final_data_sharing = current_array_data_result;
      let final_data_sharing_laggards = current_array_data_laggard;
      for (const func of PostProcessor) {
        //
        const [ress, laggs] = func(
          final_data_sharing,
          final_data_sharing_laggards
        )
        final_data_sharing = ress;
        final_data_sharing_laggards = laggs        
      }
      //
      current_array_data_result = final_data_sharing
      //
      current_array_data_laggard = final_data_sharing_laggards
      //
      //
      console.log(` ${TABLE_NAME} | CSV file successfully processed`);

      current_array_data_result.forEach((item, i) => {
        //
        row_data = Object.values(item).map((item) => {
          if (typeof item == 'string') item = `\"${item}\"`;
          return item;
        });
        //
        if (!i) {
          string_file += `INSERT INTO ${TABLE_NAME} (${columns.join(',')}) VALUES ( ${row_data.join(',')} )`
        } else {
          string_file += `,${`( ${row_data.join(',')} )`}\n`;
        }
      })
      current_array_data_laggard.forEach((item, i) => {
        //
        row_data = Object.values(item).map((item) => {
          if (typeof item == 'string') item = `\"${item}\"`;
          return item;
        });
        //
        if (!i) {
          string_file += `INSERT INTO ${TABLE_NAME} (${columns.join(',')}) VALUES ( ${row_data.join(',')} )`
        } else {
          string_file += `,${`( ${row_data.join(',')} )`}\n`;
        }
      })

      //
      if (IS_INSERT_IGNORE) string_file = replaceAll(string_file, 'INSERT', 'INSERT IGNORE');

      // Main
      write.sync(`${result_file_name}.sql`, string_file, { overwrite: true });

      // laggards
      write.sync(`${laggards_file_name}.sql`, string_file_2, { overwrite: true });
    })
    .on('error', (e) => {
      console.log('Error', e);
    });

  function PushToResult(data) {
    current_array_data_result.push(data)
  }

  function PushToLaggards(data) {
    current_array_data_laggard.push(data)
  }

};

export {
  Proccessor
}
