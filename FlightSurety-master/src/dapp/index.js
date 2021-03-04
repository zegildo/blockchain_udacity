
import DOM from './dom';
import Contract from './contract';
import './flightsurety.css';

(async() => {

    let result = null;

    let contract = new Contract('localhost', () => {

        // Read transaction
        contract.isOperational((error, result) => {
            console.log(error,result);
            display('Operational Status', 'Check if contract is operational', [ { label: 'Operational Status', error: error, value: result} ]);
        });

        contract.getAirlinesRegistred((error, result) => {

            console.log("result:", result);
            console.log("result:", result.lenght);

            var $select = $('<select/>', {
                'class':"form-select",
                'id':'sender_airline'
            });
            for (var i = 0; i < result.length; i++) {
                if(i == 0){
                    $select.append('<option selected value=' + result[i] + '>' + result[i]+ '</option>');
                }else{
                    $select.append('<option selected value=' + result[i] + '>' + result[i]+ '</option>');
                }
            }
            //$select.appendTo('#create_airline');
           
            $select.appendTo('#div_create_airlines').hide().show();
            //$select.selectmenu("refresh", true);

        });

        // User-submitted transaction
        DOM.elid('submit-oracle').addEventListener('click', () => {
            let flight = DOM.elid('flight-number').value;
            // Write transaction
            contract.fetchFlightStatus(flight, (error, result) => {
                display('Oracles', 'Trigger oracles', [ { label: 'Fetch Flight Status', error: error, value: result.flight + ' ' + result.timestamp} ]);
            });
        })

        // Airline registers Flights
        DOM.elid('submit_create_airline').addEventListener('click', () => {
            let name = DOM.elid('name_airline').value;
            let address = DOM.elid('addr_airline').value;
            let sender = DOM.elid('sender_airline').value;

            if(name != '' || address != '' || sender != ''){
                //Forward call to smart contract
                contract.registerAirline(sender, address, name, (error, result) => {
                    display('Airline Registered', 'Airline'+name+'was registered', [ { label: 'Registration:', error: error,  value: 'Success - registered. ' } ]);
                    $('#sender_airline').append('<option value="' + sender + '">' + sender + '</option>');
                    $('#sender_airline').selectmenu('refresh', true);
                    console.log("findei");
                });
            }else{
                alert("Please, fill all empty spaces!");
            }
            
        });

    
    });
})();


function display(title, description, results) {
    let displayDiv = DOM.elid("display-wrapper");
    let section = DOM.section();
    section.appendChild(DOM.h2(title));
    section.appendChild(DOM.h5(description));
    results.map((result) => {
        let row = section.appendChild(DOM.div({className:'row'}));
        row.appendChild(DOM.div({className: 'col-sm-4 field'}, result.label));
        row.appendChild(DOM.div({className: 'col-sm-8 field-value'}, result.error ? String(result.error) : String(result.value)));
        section.appendChild(row);
    })
    displayDiv.append(section);

}









