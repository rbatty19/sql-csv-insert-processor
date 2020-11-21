/**
 *
 * * IMPORTS
 *
 */
const app = require('./app');

/**
 *
 * *** CONFIG
 *
 */

//
const SETUP = [
  {
    result_file_name: 'results/ampps/ampps_result_main',
    laggards_file_name: 'results/ampps/ampps_result_for_review',
    fields: {
      AMPP_Id: 'ampp_id',
      AMPP_DSC: 'ampp_dsc',
      AMP_Id: 'amp_id',
      VMPP_Id: 'vmpp_id',
      AMPP_Estado: 'ampp_estado',
      AMPP_EstValidacion: 'ampp_estvalidacion',
      COMERCIALIZADO: 'comercializado',
    },
    IS_INSERT_IGNORE: true,
    TABLE_NAME: 'ampps',
    csv_file_path:
      'D:/Copia de Seguridad (Mis Documentos)/Escritorio/AMPP vinculados y no vinculados a productos FT 11_2020.csv',
    encoding: 'win1250',
  },
  {
    result_file_name: 'results/prods_ampps/main_t_prod_ampps_result',
    laggards_file_name: 'results/prods_ampps/for_review_t_prod_ampps_result',
    fields: {
      AMPP_Id: 'ampp_id',
      ID_PRODUCTO: 't_producto_id',
    },
    IS_INSERT_IGNORE: false,
    TABLE_NAME: 't_producto_ampp',
    csv_file_path:
      'D:/Copia de Seguridad (Mis Documentos)/Escritorio/AMPP vinculados y no vinculados a productos FT 11_2020.csv',
    encoding: 'win1250',
    ON_DUPLICATED: 'ON DUPLICATE KEY UPDATE ampp_id=VALUES(ampp_id);'
  },
];

/**
 *
 * * RUNNING
 *
 */
//

SETUP.forEach(
  ({
    laggards_file_name,
    IS_INSERT_IGNORE,
    csv_file_path,
    encoding,
    fields,
    result_file_name,
    TABLE_NAME,
  }) => {
    app.Proccessor(
      laggards_file_name,
      IS_INSERT_IGNORE,
      csv_file_path,
      encoding,
      fields,
      result_file_name,
      TABLE_NAME,
    );
  },
);
