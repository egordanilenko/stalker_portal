
        function TestTable1() {
            $('#datatable-1').on('xhr.dt', function (e, settings, json) {
                if (typeof (json.data) == 'object') {
                    for (var i in json.data) {
                        var row = json.data[i];
                        for (var key in row) {
                            if (key == 'name') {
                                var val = row[key];
                                json.data[i][key] = '<a href="{{app.request_context.baseUrl}}/tv-channels/edit-channel?id=' + row.itv_id + '">'+ val +'</a>';
                            }
                        }    
                    }
                }
            }).dataTable({
                "processing": true,
                "serverSide": true,
                "ajax": {
                    "url": "{{ app.request_context.baseUrl }}/{{ app.controller_alias }}/stat-tv-list-json",
                    "data": function (d) {
                        d = dataTableDataPrepare(d);
                        $('input[id^="datepicker_"]').each(function () {
                            d['filters[' + $(this).attr("id").replace("datepicker_", "interval_") + ']'] = $(this).val();
                        });
                    }
                },
                "language": {
                    "url": "{{ app.datatable_lang_file }}"
                },
                {% if attribute(app, 'dropdownAttribute') is defined %}
                {{ main_macro.get_datatable_column(app['dropdownAttribute']) }}
                {% endif %}
                "bFilter": true,
                "bPaginate": true,
                "bInfo": true,
				"columnDefs": [ {"searchable": false, "targets": [2] } ]
            });
        }

        function yelp() {
            $(document).ready(function () {
                {{ main_macro.get_datepicker_js_script() }}
                LoadDataTablesScripts(TestTable1);
            });
        }

        document.addEventListener("DOMContentLoaded", yelp, false);