/**
 *
 * * IMPORTS
 *
 */
import { Proccessor } from 'sql-csv-insert-processor';

/**
 *
 * *** CONFIG
 *
 */

//
const SETUP: ProcessorSetup[] = [
  {
    PreProcessor: [(data) => data],
    ON_DUPLICATED: '',
    OnCreatePreSQL: OnCreatePreSQL,
    result_file_name: 'exported/annotations/ann_box',
    laggards_file_name: 'exported/annotations/for_review_ann_box',
    fields: {
      t_producto_id: 't_producto_id',
      ampp_id: 'ampp_id',
    },
    IS_INSERT_IGNORE: true,
    TABLE_NAME: 'ann_box',
    csv_file_path:
      './src/assets/ampps_duplicados - 1.csv',
    encoding: 'win1250',
  },
];

function OnCreatePreSQL(data: any[]): any[] {
  var index = -1;
  data = data.reduce((acc, current) => {
    index = acc.findIndex(item => item.t_producto_id === current.t_producto_id);
    if (index < 0) {
      acc.push(current);
    } else {
      if(acc[index].ampp_id.length < current.ampp_id.length) acc[index] = current;
    }
    return acc;
  }, []);
  return data;
}

/**
 *
 * * RUNNING
 *
 */
//

SETUP.forEach(
  (setup_config) => {
    Proccessor(setup_config);
  },
);
