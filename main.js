(function(doc){

    "use strict";

    function app() {
        var $formCep = doc.querySelector('[data-js=formCEP]');
        var $inputCep = doc.querySelector('[data-js=cep]');
        var $inputLogradouro = doc.querySelector('[data-js=logradouro]');
        var $inputBairro = doc.querySelector('[data-js=bairro]');
        var $inputCidade = doc.querySelector('[data-js=cidade]');
        var $inputEstado = doc.querySelector('[data-js=estado]');
        var $inputArea = doc.querySelector('[data-js=result]');
        var ajax = new XMLHttpRequest();
        $formCep.addEventListener('submit', handleSubmitFormCEP, false);

        function handleSubmitFormCEP(e) {
            e.preventDefault();
    
            if (!isCepFieldOk()) return clearData();
    
            var url = getUrl();
            ajax.open('GET', url);
            ajax.send();
            getMessage('loading');
            ajax.addEventListener('readystatechange', handleReadyStateChange);
        }
    
        function getUrl() {
            return 'https://viacep.com.br/ws/' + clearCEP() + '/json/';
        }
    
        function clearCEP() {
            return $inputCep.value.replace(/\D/g, '')
        }
    
        function handleReadyStateChange() {
            if ( isRequestOk() && isReturnValid() ) {
                fillFields();
                getMessage('ok');
            } else {
                getMessage('error');
                clearData();
            }
        }
    
        function isRequestOk() {
            return ajax.readyState === 4 && ajax.status === 200;
        }
    
        function isReturnValid() {
            var data = parseData();
    
            if (data.erro || !data) return false;
    
            return true;
        }
    
        function fillFields() {           
            var data = parseData();
            $inputLogradouro.value = data.logradouro;
            $inputBairro.value = data.bairro;
            $inputCidade.value = data.localidade;
            $inputEstado.value = data.uf;
        }
    
        function parseData() {
            var result;
            
            try {
                result = JSON.parse(ajax.responseText);
            } catch (e) {
                result = null;
            }
            
            return result;
        }  
    
        function getMessage(type) {
            var cep = clearCEP();
    
            var messages = {
                loading: 'Buscando informações para o CEP ' + cep,
                ok: 'Endereço referente ao CEP ' + cep,
                error: 'Não encontramos o endereço para o CEP ' + cep
            }
            $inputArea.innerHTML = messages[type];
        }
    
        function isCepFieldOk() {
            if (clearCEP().length != 8) {
                $inputArea.innerHTML = "Formato inválido. O CEP deve conter 8 caracteres.";
                return false;
            } else 
                return true;
        }
    
        function clearData() {
            $inputBairro.value="";
            $inputCidade.value="";
            $inputEstado.value="";
            $inputLogradouro.value="";
        }

        return {
            getMessage: getMessage,
            clearData: clearData
        }
    }

    window.app = app();
    app();

})(document);