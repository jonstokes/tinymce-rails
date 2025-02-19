if (typeof UPLOADCARE_CROP == 'undefined') {
    UPLOADCARE_CROP = '';
}
(function() {
    tinymce.ScriptLoader.add('https://ucarecdn.com/widget/2.5.1/uploadcare/uploadcare.full.min.js');

    tinymce.create('tinymce.plugins.UploadcarePlugin', {
        init : function(ed, url) {
            tinymce.ScriptLoader.add(url + '/config.js');
            tinymce.ScriptLoader.loadQueue();

            ed.addButton('uploadcare', {
                title : 'Uploadcare',
                cmd : 'showUploadcareDialog',
                image : url + '/logo.png',
                stateSelector : 'img'
            });

            ed.addCommand('showUploadcareDialog',function() {
                var dialog = uploadcare.openDialog().done(function(file) {
                    file.done(function(fileInfo) {
                        if (fileInfo.isImage) {
                            ed.execCommand('mceInsertContent', false, '<img src="' + fileInfo.cdnUrl + '" class="img-responsive"/>');
                        } else {
                            ed.execCommand('mceInsertContent', false, '<a href="' + fileInfo.cdnUrl + '">' + fileInfo.name + '</a>');
                        };

                        // Create new asset for uploaded image
                        jQuery.ajax({
                          url: "assets/create",
                          type: "POST",
                          data: {
                            asset: {
                              file_url: fileInfo.cdnUrl
                            }
                          },
                          dataType: "json",
                          success: function(data){
                            // data will be the response object(json)
                          }
                        });
                    });
                });
            });
        },

        createControl : function(n, cm) {
            return null;
        },

        getInfo : function() {
            return {
                longname : 'Uploadcare',
                author : 'Uploadcare',
                authorurl : 'https://uploadcare.com/',
                infourl : 'https://github.com/uploadcare/uploadcare-tinymce',
                version : "2.0.0"
            };
        }
    });

    tinymce.PluginManager.add('uploadcare', tinymce.plugins.UploadcarePlugin);
})();
