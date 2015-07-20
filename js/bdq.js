var BDQ = {
    "init"  :   function() {
        // Datepicker plugin init
        $('.input-group.date').datetimepicker();
    },
    "showMainNav" : function() {alert()},
    "hideMainNav" : function() {},
    "showForm" : function() {},
    "hideForm" : function() {},
    "updateIFrame"  : function(content) {
        $('#D_Frame').contents(content);
        console.log(content);
    },
    "domains"   : {
        
    },
    "requestCrossDomain": function ( site, callback ) {            
        // Accepts a url and a callback function to run.
        // If no url was passed, exit.
        if ( !site ) {
            alert('No site was passed.');
            return false;
        }
         
        // Take the provided url, and add it to a YQL query. Make sure you encode it!
        var yql = 'http://query.yahooapis.com/v1/public/yql?q=' + encodeURIComponent('select * from html where url="' + site + '"') + '&format=xml&callback=?';
        
        console.log('yql = ', yql);
         
        // Request that YSQL string, and run a callback function.
        // Pass a defined function to prevent cache-busting.
        $.getJSON( yql, cbFunc );
         
        function cbFunc(data) {
        // If we have something to work with...
        if ( data.results[0] ) {
            
            // Strip out all script tags, for security reasons.
            // BE VERY CAREFUL. This helps, but we should do more. 
            data = data.results[0].replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '');
             
            // If the user passed a callback, and it
            // is a function, call it, and send through the data var.
            if ( typeof callback === 'function') {
                callback(data);
            }
            

        }
        // Else, Maybe we requested a site that doesn't exist, and nothing returned.
        else throw new Error('Nothing returned from getJSON.');
        
    }
}
 

}

function loadPage(site) {
    BDQ.requestCrossDomain(site, function(results){
        $('#D_Frame').contents('');
        $('#D_Frame').html(results);
    });    
}

function createWrapper() {
    var $_elem = $('#D_Frame').find('#CourseInfoSchedulesContainer .classInfo'),
        $_item = $_elem.find('div');
        
    $_elem.css('border','1px solid blue');
    
    $('#D_Frame #page_left_column').remove();
    $('#D_Frame #page_header').remove();
    
    $_elem.on('click', function() {
        captureCourseData($(this));
    });
    
}

function createString($_item) {
    var x = $($_item).text().split(':')[1].toString();
    return x;
}

function captureCourseData($_elem) {
    var $_item = $_elem.find('div'),
        CrsDescription = $('#D_Frame').find('.CDMPageTitle').next().text(),        
        Section = $($_item[0]).text().split(':')[1].toString().replace(/(\r\n|\n|\r)/gm,""), //removing line breaks
        Section = Section.replace(/\s+/g, ''), //replace whitespace with space
        ClassNum = $($_item[1]).text().split(':')[1].toString().replace(/(\r\n|\n|\r)/gm,""), //removing line breaks
        ClassNum = ClassNum.replace(/\s+/g, ''), //replace whitespace with space
        MeetTime = $($_item[2]).text().split(/(\r\n|\n|\r)/gm); //splitting at line breaks
        MeetTime_Days = MeetTime[4].replace(/\s+/g, ''), //remove whitespace
        MeetTime_Start = MeetTime[6].replace(/\s+/g, ''),
        MeetTime_End = MeetTime[10].replace(/\s+/g, ''),
        Location = $($_item[3]).text().split(':')[1].toString().replace(/(\r\n|\n|\r)/gm,""),
        Location = Location.replace(/\s+/g, " "), //replace whitespace with space
        Instructor = $($_item[4]).text().split(':')[1].toString(),
        Instructor = Instructor.split('|')[0].replace(/(\r\n|\n|\r)/gm,""),
        Instructor = Instructor.replace(/\s+/g, " "), //replace whitespace with space
        CourseTitle = $('#D_Frame').find('.CDMPageTitle').text().toString().replace(/\s+/g, " ");
        
    addToForm('#Course_Form', 'CrsTitle', CourseTitle);   
    addToForm('#Course_Form', 'SecNumber', Section);
    addToForm('#Course_Form', 'ClassNumber', ClassNum);
    addToForm('#Course_Form', 'Location', Location);
    addToForm('#Course_Form', 'Instructor', Instructor);
    addToForm('#Course_Form', 'Days_Times', MeetTime_Days + ' ' + MeetTime_Start + ' ' + MeetTime_End);
    addToForm('#Course_Form', 'CrsDescription', CrsDescription);
            
}

function addToForm($_form, field, string_data){
    var     $_DForm = $('#D_Frame').find($_form),
            $_DField = $(document.getElementsByName(field));
    
    $_DField.val(string_data);
        
}

/*

#CourseInfoSchedulesContainer .classInfo = class information
Section, Class number, Meeting time, Location, Instructor
$('#D_Frame #CourseInfoSchedulesContainer .classInfo').css('border', '1px solid blue');

#CourseInfoSchedulesContainer .classInfo #page_left_column = nav
$('#D_Frame #page_left_column').remove();
$('#D_Frame #page_header').remove();
    */

$(function(){
    BDQ.init();

    //EVENT LISTENERS FOR MAIN NAV       
    $('#Main_Nav a').click(function(){
        var siteLink = $(this).attr('rel'),
            activeForm = $(this).attr('href');
        loadPage(siteLink);
        //show active form
        $(activeForm).show();
        $('.form-container form').not(activeForm).hide();
        
        console.log('activeForm = ', activeForm);
        
        return false;                          

    });
    
    //EVENT LISTENER FOR DETAIL TOGGLE
    $('.showDetails').on('click', function() {
        $('.secondary-info').toggle();  
        return false;      
    })
    
});