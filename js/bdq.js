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
    var $_elem = $('#CourseInfoSchedulesContainer .classInfo'),
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
        Section = $($_item[0]).text().split(':')[1].toString().replace(/(\r\n|\n|\r)/gm,""), 
        ClassNum = $($_item[1]).text().split(':')[1].toString().replace(/(\r\n|\n|\r)/gm,""),
        MeetTime = $($_item[2]).text().split(/(\r\n|\n|\r)/gm); //splitting at line breaks
        MeetTime_Days = MeetTime[4].replace(/\s+/g, ''),
        MeetTime_Start = MeetTime[6].replace(/\s+/g, ''),
        MeetTime_End = MeetTime[10].replace(/\s+/g, ''),
        Location = $($_item[3]).text().split(':')[1].toString().replace(/(\r\n|\n|\r)/gm,""),
        Instructor = $($_item[4]).text().split(':')[1],
        Instructor = Instructor.split('|')[0].replace(/(\r\n|\n|\r)/gm,"");
        
    console.log('Section: ', Section.replace(/\s+/g, ''));                            
    console.log('ClassNum: ', ClassNum.replace(/\s+/g, ''));                            
    console.log('MeetTime: ', MeetTime_Days, MeetTime_Start, MeetTime_End);                            
    console.log('Location: ', Location);                            
    console.log('Instructor: ', Instructor);  
    
    return false;                          
}

function addToForm(){
    
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
    });
    
});