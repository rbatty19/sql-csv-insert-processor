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
    result_file_name: 'exported/annotations/ann_box',
    laggards_file_name: 'exported/annotations/for_review_ann_box',
    fields: {
      attachment_url: 'image_url_address',
      instructions: 'details',
      with_labels: 'with_labels'
    },
    IS_INSERT_IGNORE: true,
    TABLE_NAME: 'ann_box',
    csv_file_path:
      './src/assets/Trainingset.ai - box annotation example - demo.csv',
    encoding: 'win1250',
    ON_DUPLICATED: '',
    PreProcessor: [
      (data, callbackSaveResult, callbackSaveLaggards) => {

        console.log(data);

        callbackSaveResult(data);
        callbackSaveLaggards(data);

        return data;
      }
    ],
    PostProcessor: []
  },
  // {
  //   result_file_name: 'results/prods_ampps/main_t_prod_ampps_result',
  //   laggards_file_name: 'results/prods_ampps/for_review_t_prod_ampps_result',
  //   fields: {
  //     AMPP_Id: 'ampp_id',
  //     ID_PRODUCTO: 't_producto_id',
  //   },
  //   IS_INSERT_IGNORE: false,
  //   TABLE_NAME: 't_producto_ampp',
  //   csv_file_path:
  //   './src/assets/Trainingset.ai - box annotation example - demo.csv',
  //   encoding: 'win1250',
  //   ON_DUPLICATED: ''
  // },
];

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
