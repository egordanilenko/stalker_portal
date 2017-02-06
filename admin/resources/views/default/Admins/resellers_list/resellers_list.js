
        var select2Opt = {minimumResultsForSearch: -1, dropdownAutoWidth: false, width: '100%'};
        
        function DemoSelect2() {
                $.fn.select2.defaults.set('dropdownAutoWidth', 'false');
                $.fn.select2.defaults.set('width', '100%');
                $('#target_reseller').select2(select2Opt);
        }

        function TestTable1() {
            $('#datatable-1').on('xhr.dt', function (e, settings, json) {
                if (typeof (json.data) == 'object') {
                    for (var i in json.data) {
                        var id = json.data[i].id;
                        var name = json.data[i].name;
                        json.data[i].operations = "<div class='col-xs-3 col-sm-8'>\n\
                                                        <a href='#' class='dropdown-toggle no_context_menu' data-toggle='dropdown'>\n\
                                                            <i class='pull-right fa fa-cog'></i>\n\
                                                        </a>\n\
                                                        <ul class='dropdown-menu pull-right'>\n\
                                                            <li>\n\
                                                                <a class='main_ajax no_context_menu' href='{{ app.request_context.baseUrl }}/{{ app.controller_alias }}/move-users-to-reseller' data-id='" + id +"'>\n\
                                                                    <span>{{ 'Move all users to another reseller'|trans }}</span>\n\
                                                                </a>\n\
                                                            </li>\n\
                                                        ";
                        if (id !== '-') {
                            json.data[i].operations += "<li>\n\
                                                            <a class='main_ajax no_context_menu' href='{{ app.request_context.baseUrl }}/{{ app.controller_alias }}/resellers-list-json' data-id='" + id + "'>\n\
                                                                    <span>{{ 'Edit'|trans }}</span>\n\
                                                                </a>\n\
                                                            </li>\n\
                                                            <li>\n\
                                                                <a class='main_ajax no_context_menu' href='{{ app.request_context.baseUrl }}/{{ app.controller_alias }}/resellers-delete' data-id='" + id + "'>\n\
                                                                    <span> {{ 'Delete'|trans }} </span>\n\
                                                                </a>\n\
                                                            </li>";
                            json.data[i].name = '<a class="main_ajax no_context_menu" href="{{ app.request_context.baseUrl }}/{{ app.controller_alias }}/resellers-list-json" data-id="' + id + '">' + name + '</a>';
                        }
                        json.data[i].operations += "</ul>\n\
                                                    </div>";
                        if (json.data[i].max_users <= 0) {
                            json.data[i].max_users = "&#8734";
                        }
                        var possibleDateKeys = ['created', 'modified'], date;
                        for (var num in possibleDateKeys) {
                            var key = possibleDateKeys[num];
                            if (typeof(json.data[0][key]) != 'undefined') {
                                date = json.data[i][key];
                                if (date > 0) {
                                    date = new Date(date * 1000);
                                    json.data[i][key] = date.toLocaleFormat("%b %d, %Y %H:%M");
                                }
                            }
                        }
                    }
                }
            }).dataTable({
                "processing": true,
                "serverSide": true,
                "ajax": {
                    "url": "{{ app.request_context.baseUrl }}/{{ app.controller_alias }}/resellers-list-json"
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
                "columnDefs": [
                    {className: "action-menu", "targets": [-1]},
                    {"searchable": false, "targets": [-1, 2, 3, 4, 5]},
                    {"sortable": false, "targets": [-1]}
                ]
            }).prev('.dataTables_processing').hide('');
        }

        function yelp() {
            $(document).ready(function () {

                $(document).on('click', "a.main_ajax:not([href*='move-users-to-reseller'])", function (e) {
                    e.stopPropagation();
                    e.preventDefault();
                    var sendData = $(this).data();
                    ajaxPostSend($(this).attr('href'), sendData, false, false);
                    $(this).closest('div.open').removeClass('open');
                    return false;
                });

                $(document).on('click', "#form_reset", function (e) {
                    e.stopPropagation();
                    e.preventDefault();
                    if (!$(this).closest('form').find("input[type='hidden']").val()) {
                        $('#modalbox form').get(0).reset();
                    }
                    JScloseModalBox();
                    return false;
                });

                $(document).on('click', "#modalbox_ad button[type='submit'], #modalbox button[type='submit']", function (e) {
                    e.stopPropagation();
                    e.preventDefault();
                    var _this = $(this);
                    var sendData = new Object();
                    var form_fields = _this.closest("div[id*='modalbox']").find('form').find(".own_fields:not(:disabled)");
                    form_fields.each(function () {
                        if ($(this).val()) {
                            sendData[this.name] = $(this).val();
                        }
                    });
                    var action = _this.closest("div[id*='modalbox']").find('form').attr('action');
                    ajaxPostSend(action, sendData, false, false);
                    return false;
                });

                $("#add_reseller").on("click", function (e) {
                    e.stopPropagation();
                    e.preventDefault();
                    $("#modalbox_ad").find(".modal-header-name").children('span').text('{{ 'Adding reseller'|trans }}');
                    $("#modalbox_ad input").removeAttr('disabled').val('');
                    $("#modalbox_ad input[type='hidden']").attr('disabled', 'disabled');
                    $("#modalbox_ad").show();
                    return false;
                });

                $(document).on('click', "a[href*='move-users-to-reseller']", function (e) {
                    e.stopPropagation();
                    e.preventDefault();
                    $("#modalbox").data('complete', 1);
                    $('#modalbox').find('.modal-header-name span').text("{{ 'Resellers'|trans }}");
                    var formHtml = '\n\
                <div class="box-content">\n\
                    <form class="form-horizontal" role="form" action="{{ app.request_context.baseUrl }}/{{ app.controller_alias }}/move-users-to-reseller">\n\
                        <div class="form-group">\n\
                            <label class="col-sm-3 control-label col-sm-offset-1">{{ 'Reseller name'|trans }}</label>\n\
                            <div class="col-xs-10 col-sm-8">\n\
                                <span class="col-xs-12 col-sm-12">\n\
                                    <input type="hidden" class="own_fields" name="source_id" value="'+ $(this).data('id') + '">\n\
                                    <select class="own_fields" name="target_id" id="target_reseller">\n\
                                        <option value="-" >{{ 'Empty'|trans }}</option>\n\
                    {% if attribute(app, 'allResellers') is defined %}
                        {% for row in app.allResellers %}
                                    <option value="{{ row.id }}" >{{ row.name }}</option>\n\
                        {% endfor %}
                    {% endif %}
                                </span>\n\
                            </div>\n\
                        </div>\n\
                    </form>\n\
                </div>';
                    $('#modalbox').find('.devoops-modal-inner').html(formHtml);
                    $('#modalbox').find('.devoops-modal-bottom').html('<div class="pull-right no-padding">&nbsp;</div>\n\
                        <div class="pull-right no-padding">\n\
                            <button type="submit" class="btn btn-success pull-right">{{ 'Move'|trans }}</button>\n\
                            <button type="reset" id="form_reset" class="btn btn-default pull-right" >{{ 'Cancel'|trans }}</button>\n\
                        </div>');

                    $("#target_reseller option[value='"+$(this).data('id')+"']").prop('selected', 'selected');
                    $("#target_reseller").select2(select2Opt);

                    $("#modalbox").show();
                    $(this).closest('div.open').removeClass('open');
                    return false;
                });

                LoadSelect2Script(DemoSelect2);
                LoadDataTablesScripts(TestTable1);
            });
        }

        document.addEventListener("DOMContentLoaded", yelp, false);
        
        var setResellerModal = function (data) {
            $("#modalbox_ad").find(".modal-header-name").children('span').text('{{ 'Editing reseller'|trans }}');
            if (data.data.length == 1) {
                var row = data.data[0];
                for (var field_name in row) {
                    $("#modalbox_ad input[name='" + field_name + "']").val(row[field_name]);
                }
            }
            $("#modalbox_ad input").removeAttr('disabled');
            $("#modalbox_ad").show();
        };