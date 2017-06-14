angular.module('vimedo').controller('solicitudesCtrl', ['$rootScope', 'solicitudesService', '$state', 'growl', solicitudesCtrl]);

function solicitudesCtrl(r, solicitudesService, state, growl) {
    var vm = this;

    vm.solicitudes = [];
    vm.solicitudesOrig = [];
    vm.modalPro = {
        sintomas: [],
        antecedentes: []
    };
    vm.objSel = {};

    vm.tableConfig = {
        maxPages: "10",
        itemsPerPage: "8"
    };
    vm.newModal = '';

    vm.filterList = function() {
        var lower = vm.query.toLowerCase();
        vm.solicitudes = vm.solicitudesOrig
            .filter(function(i) {
                if (i.afiliado.personaFisica.nombre.toLowerCase().indexOf(lower) !== -1 ||
                    i.afiliado.personaFisica.apellido.toLowerCase().indexOf(lower) !== -1) {
                    return i;
                }
            });
    }

    vm.updateList = function() {
        solicitudesService.list().then(function(data) {
            vm.solicitudes = data;
            vm.solicitudesOrig = data;
        });
    }
    vm.newSol = function() {
        vm.modalPro = {
            sintomas: [],
            antecedentes: []
        };
        $(vm.newModal).modal();
    };

    vm.view = function(obj) {
        vm.objSel = obj;
        $('#viewModal').modal();
    };

    vm.finishSave = function() {
        vm.modalPro = {
            sintomas: [],
            antecedentes: []
        };
        vm.updateList();
        $(vm.newModal).modal('hide');
    }

    vm.updateList();
}