
        function TestTable1() {
            $('#datatable-1').on('xhr.dt', function (e, settings, json) {
                if (typeof (json.data) == 'object' && json.data.length >0) {
                    var date;
                    for (var i in json.data) {
                        var id = json.data[i].id;
                        if (json.data[i].accessed == 1) {
                            json.data[i].accessed = '<span class="">{{ 'Published'|trans }}</span>';
                        } else if (typeof(json.data[i].tasks) != 'undefined' && json.data[i].tasks.toString() != 0){
                            json.data[i].accessed = '<span class="">{{ 'Scheduled'|trans }}</span>';
                        } else {
                            json.data[i].accessed = '{{ 'Unpublished'|trans }}';
                        }
                        date = json.data[i]['last_played'];
                        if (date > 0) {
                            date = new Date(date * 1000);
                            json.data[i]['last_played'] = date.toLocaleFormat("%b %d, %Y %H:%M");
                        }
                    }
                }
            }).dataTable({
                "processing": true,
                "serverSide": true,
                "ajax": {
                    "url": "{{ app.request_context.baseUrl }}/{{ app.controller_alias }}/storages-video-search-json",
                    "data": function (d) {
                        d = dataTableDataPrepare(d);
                        $('#video_search_form input').each(function(){
                            if (typeof(d['filters']) == 'undefined') {
                                d["filters"] = {};
                            }
                            var name = this.name.replace('[', '').replace(']', '');
                            if (this.type.toLowerCase() == 'checkbox') {
                                 if ($(this).is(":checked")){
                                    if (typeof(d["filters"][name]) == 'undefined') {
                                        d["filters"][name] = [];     
                                    }
                                    d["filters"][name].push(this.value);         
                                 }
                            }else if (this.value) {
                                d["filters"][this.name] = this.value;         
                            }
                        });
                    }
                },
                "language": {
                    "url": "{{ app.datatable_lang_file }}"
                },
                {% if attribute(app, 'dropdownAttribute') is defined %}
                {{ main_macros.get_datatable_column(app['dropdownAttribute']) }}
                {% endif %}
                "bFilter": true,
                "bPaginate": true,
                "bInfo": true,
                "columnDefs": [ {"searchable": false, "targets": [-1, -2, -5]}]
            });
        }

        function yelp() {
            $(document).ready(function () {
                
                $(document).on('change', "#not_on_storages :checkbox, #on_storages :checkbox, #not_on_storages li:first-of-type label, #on_storages li:first-of-type label", function(e){
                    var prefix = ($(this).closest('div.attribute_set').attr('id') == "on_storages"? "not_": "" );
                    if (($(this).val() != 'all')) {
                        var filter = ($(this).val() != 'all') ? "[value='" + $(this).val() +"']": '';
                        var oponent = "#" + prefix + "on_storages :checkbox";
                        if ($(this).is(':checked') && $(oponent + filter).is(':checked')) {
                            $(oponent + filter).prop('checked', false).removeAttr('checked');
                            $(oponent + "[value='all']").prop('checked', false).removeAttr('checked');
                        }
                    } else {
                        $("#" + prefix +'on_storages ul li:first-of-type label').click();
                    }
                });
                
                $(document).on('click  mousedown mouseup', "#not_on_storages ul li:first-of-type label, #on_storages ul li:first-of-type label", function(e){
                    if ($(this).find(":checkbox").is(":checked")) {
                        var prefix = ($(this).closest('div.attribute_set').attr('id') == "on_storages"? "not_": "" );
                        $("#"+prefix+"on_storages :checkbox").prop('checked', false).removeAttr('checked');
                    }
                });
                
                $(document).on('click', '#video_search_submit', function(){manageList();});
                $(document).on('submit', '#video_search_form', function(e){
                    $("#video_search_form").find('input[name="textview"]').val(1);
                    setTimeout(function(){$("#video_search_form").find('input[name="textview"]').val(0);}, 1000);
                });
                
                $(document).on('click', "a.main_ajax[disabled!='disabled']", function (e) {
                    e.stopPropagation();
                    e.preventDefault();
                    $("#modalbox").data('complete', 0);
                    showModalBox();
                    var sendData = $(this).data();
                    ajaxPostSend($(this).attr('href'), sendData, false, false, true);
                    $(this).closest('div.open').removeClass('open');
                    return false;
                });
                
                        
                $(document).on('click', "#modalbox, #modalbox a.close-link, #modalbox a.close-link *", function(e){
                    if (e.currentTarget != e.target) {
                        return;
                    }
                    e.stopPropagation();
                    e.preventDefault();
                    if ($("#modalbox").data('complete') && $("#modalbox").data('complete') == 1) {
                        closeModalBox();
                    } else {
                        for(i=0;i<3;i++) {
                            $('#modalbox > div').fadeTo('slow', 0.5).fadeTo('slow', 1.0);
                        }
                    }
                    return false;
                });

                LoadDataTablesScripts(TestTable1);
            });
        }

        document.addEventListener("DOMContentLoaded", yelp, false);
              
        var manageList = function (obj) {
            $('#datatable-1').DataTable().ajax.reload();
            $("#modalbox").data('complete', 1);
            $('#modalbox').find('.devoops-modal-inner').html('<span>{{ 'Finished'|trans }}!</span>');
        };
        
        var listMsg = function(data){
            if (typeof(data.msg) != 'undefined' && data.msg) {
                alert(data.msg);
            }
            manageList(data);
        };
        
        var listMsgError = function(data){
            if (typeof(data.msg) != 'undefined' && data.msg) {
                alert(data.msg);
            }
            errAction();
        };
        
        function closeModalBox(){
            $("#modalbox").hide();
            $('#modalbox').find('.modal-header-name span').empty();
            $('#modalbox').find('.devoops-modal-inner').empty();
            $('#modalbox').find('.devoops-modal-bottom').empty();
        }
        
        function showModalBox(){
            $('#modalbox').find('.modal-header-name span').text('{{ 'Wait'|trans }}...');
            $('#modalbox').find('.devoops-modal-inner').html('<span>{{ 'Request is being processed'|trans }}...</span>');
            $("#modalbox").show();
        }
               
        var errAction = function(){
            $('#modalbox').find('.devoops-modal-inner').html('<span>{{ 'Failed'|trans }}!</span>');
            $("#modalbox").data('complete', 1);
        }