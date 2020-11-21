
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
  ON_DUPLICATED?: string
}