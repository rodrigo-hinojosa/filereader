$(function () {

    'use strict';

    const Main = {

        init: function () {

            $('#fileinput').change(function () {

                Main.checkReadFileProccess();

            });

            $('#valueSearch').change(function () {

                Main.checkReadFileProccess();

            });

            $('#btn-read-file').on('click', function (e) {

                Main.readFile();

            });


            $('#btn-export-file').on('click', function (e) {

                Main.saveFileResult();

            });

        },
        loadingByProcess: function () {

            swal({
                title: "Procesando...",
                text: "Espere mientras se ejecuta la solicitud.",
                type: "info",
                showCancelButton: false,
                confirmButtonColor: "#007AFF",
                confirmButtonText: "OK",
                cancelButtonText: "NO",
                closeOnConfirm: false,
                showLoaderOnConfirm: true
            });

        },
        errorProcessMessage: function () {

            swal({
                title: "Ocurrio algo inesperado",
                text: "Hubo un problema al intentar procesar el archivo",
                type: "error",
                confirmButtonColor: "#007AFF",
                confirmButtonText: "OK"
            });

        },
        successProcessMessage: function () {

            swal({
                title: "Perfecto!",
                text: "La solicitud se procesó con éxito.",
                type: "success",
                confirmButtonColor: "#469408"
            });

        },
        checkReadFileProccess: function () {

            if ($('#fileinput').get(0).files.length === 0 || $('#valueSearch').val() === '') {

                $('#btn-read-file').prop('disabled', true);

            } else {

                $('#btn-read-file').prop('disabled', false);

            }

        },
        browserSupportFileUpload: function () {

            let isCompatible = true;

            if (window.File && window.FileReader && window.FileList && window.Blob) {

                isCompatible = false;
            }

            return isCompatible;

        },
        browserSupportFileUploadMessage: function () {

            swal({
                title: 'Navegador Incompetible',
                text: 'Para el correcto funcionamiento de la App debe usar Google Chrome',
                type: 'error',
                confirmButtonColor: '#007AFF',
                confirmButtonText: 'OK'
            });

        },
        supportFileUpload: function (input) {

            let isCompatible = false;

            let extension = (input.substring(input.lastIndexOf('.'))).toLowerCase();

            if (extension === '.txt') {

                isCompatible = true;

            }

            return isCompatible;

        },
        supportFileUploadMessage: function () {

            setTimeout(function () {

                $('#btn-read-file').prop('disabled', true);

                $('#fileinput').filestyle('clear');

                swal({
                    title: 'Tipo de archivo inválido',
                    text: 'Verifique que el archivo corresponda al formato correcto.',
                    type: 'error',
                    confirmButtonColor: '#007AFF',
                    confirmButtonText: 'OK'
                });

            }, 500);

        },
        readFile: function () {

            const evt = $('#fileinput');

            if (!Main.supportFileUpload(evt.val())) {

                Main.supportFileUploadMessage();

                return;
            }

            if (Main.browserSupportFileUpload()) {

                Main.browserSupportFileUploadMessage();

                return;
            }

            swal({
                    title: 'Esta seguro de Continuar ?',
                    text: 'La lectura del archivo podria tomar algunos momentos...',
                    type: 'info',
                    showCancelButton: true,
                    confirmButtonColor: "#007AFF",
                    confirmButtonText: "SI",
                    cancelButtonText: "NO",
                    closeOnConfirm: false,
                    showLoaderOnConfirm: false,
                },

                function () {

                    Main.loadingByProcess();

                    setTimeout(function () {

                        const valueSearch = $('#valueSearch').val();

                        const file = evt.get(0).files[0];

                        const reader = new FileReader();

                        reader.onload = function () {

                            try {

                                let count = this.result.split('\n').length - 1;

                                let rows = this.result.split('\n');

                                if (count > 0) {

                                    let match = [];

                                    rows.forEach(function (row) {

                                        if (row.substring(40, 48).match(valueSearch)) {

                                            match.push(row);

                                        }

                                    });

                                    $('#btn-export-file').prop('disabled', false);

                                    $('#result').val(match.join("\n"));

                                    Main.successProcessMessage();
                                }

                            }
                            catch (err) {

                                console.log(err);

                                Main.errorProcessMessage();

                            }
                        };
                        reader.readAsText(file);

                    }, 500);

                }, function () {

                });

        },
        saveFileResult: function () {

            let text = $('#result').val();

            let filename = $('#valueSearch').val();

            let element = document.createElement('a');
            element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
            element.setAttribute('download', filename);

            element.style.display = 'none';
            document.body.appendChild(element);

            element.click();

            document.body.removeChild(element);
        }
    };

    Main.init();

});
