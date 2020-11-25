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
      /**
       * @param {*} data represents current row data
       * @param {requestCallback} PushToResult Run the function which save the row data into first result file
       * @param {requestCallback} PushToLaggards Run the function which save the row data into first result file
       * @param {[]} currentResultArray Includes the curretly saved data (for results) to be passed to PostProcessor
       * @param {[]} currentLaggardArray Includes the curretly saved data (for laggards) to be passed to PostProcessor
       */
      (
        data,
        callbackSaveResult,
        callbackSaveLaggards,
        currentResultArray,
        currentLaggardArray
      ) => {

        console.log(data);

        callbackSaveResult(data);
        callbackSaveLaggards(data);

        /* 
        if (currentResultArray.includes( ... )) {
          ...
         } 
         */

        return data;
      }
    ],
    PostProcessor: [
      (
        arrayResult,
        arrayLaggards
      ) => {

        // YOU CAN CHECK OR EDIT THEM BEFORE BUILDIND FILES

        return [arrayResult, arrayLaggards];
      }
    ]
  },
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
