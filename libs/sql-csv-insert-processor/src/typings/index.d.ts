


/**
 * 
 */
interface ProcessorSetup {
  result_file_name: string,
  laggards_file_name: string,
  /**
   * @param encoding field to specify which column will be assigned what name
   */
  fields: Object,
  csv_file_path: string,
  /**
   * @param encoding format to decode .csv file
   */
  encoding: string | 'win1250',
  // >< ---------      SQL     ------------------
  TABLE_NAME: string,
  IS_INSERT_IGNORE: boolean,
  ON_DUPLICATED: string,

  /**
 * @param data represents current row data
 **/

  PreProcessor: Array<(data: any) => object | string | number | boolean>,
  OnCreatePreSQL: (currentData: Array<any>) => Array<any>,
}

declare module 'sql-csv-insert-processor' {
  export function Proccessor(
    data: ProcessorSetup
  ): void;
}

