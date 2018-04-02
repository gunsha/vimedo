angular.module('vimedo').controller('authCtrl', ['$scope', '$rootScope', 'authService', '$state', 'jwtHelper', '$timeout', 'NgMap', 'growl', authCtrl]);

function authCtrl(s, r, authService, state, jwtHelper, t, NgMap, growl) {

    var vm = this;
    vm.wrongUserError = false;

    vm.isPro = false;

    vm.done = false;

    vm.newUser = {
        personaFisica: {
            telefonosA: [],
            domicilios: []
        }
    };

    NgMap.getMap().then(function(map) {
        vm.map = map;
    });

    vm.login = function() {
        authService.login(vm.credenciales).then(function(data) {
            vm.wrongUserError = false;
            localStorage.setItem('id_token', data.jwt);
            r.decoded = jwtHelper.decodeToken(data.jwt);
            r.user = r.decoded.sub.usuario;
            var profile = {};
            if (r.user.admin) {
                profile = r.user.admin.personaFisica;
            } else if (r.user.profesional) {
                profile = r.user.profesional.personaFisica;
            } else {
                profile = r.user.afiliado.personaFisica;
            }
            profile.initials = profile.nombre[0].toUpperCase() + profile.apellido[0].toUpperCase();
            r.setStorage('profile', profile);
            if (r.hasRole('ADMIN')) {
                state.go('admin');
            } else {
                state.go('app');
            }
        }, function(data) {
            vm.wrongUserError = true;
        });
    };

    vm.forgotPass = function() {
        authService.forgot(vm.forgot).then(function(data) {
            state.go('app');
        });
    };

    vm.resetPass = function() {
        authService.reset(vm.forgot).then(function(data) {
            state.go('app');
        });
    };

    vm.removeDom = function(index) {
        vm.newUser.personaFisica.domicilios.splice(index, 1);
    };

    vm.addTel = function() {
        if (vm.newUser.personaFisica.telefono && vm.newUser.personaFisica.telefono !== '') {
            vm.newUser.personaFisica.telefonosA.push(vm.newUser.personaFisica.telefono);
            vm.newUser.personaFisica.telefono = '';
        }
    };

    vm.removeTel = function(index) {
        vm.newUser.personaFisica.telefonosA.splice(index, 1);
    };

    vm.validateSave = function() {
        if (vm.newUser.personaFisica.telefonosA.length !== 0) {
            if (vm.newUser.personaFisica.domicilios.length !== 0) {
                return true;
            } else {
                growl.error("Ingrese al menos una direccion.");
            }
        } else {
            growl.error("Ingrese al menos un telefono.");
        }
        return false;

    }

    vm.saveNew = function() {
        vm.newUser.personaFisica.telefonos = vm.newUser.personaFisica.telefonosA.toString();
        if(vm.validateSave()){            
            authService.signUp(vm.newUser, Boolean(vm.isPro)).then(function() {
                vm.done = true;
            });
        }
    };

    vm.placeChanged = function() {
        vm.newUser.personaFisica.domicilios.push(getDireccion(this.getPlace()));
        vm.afilDir = '';
    }

    vm.registrarse = function() {
        authService.signUp(vm.credenciales).then(function(data) {
            localStorage.setItem('id_token', data.jwt);
            r.decoded = jwtHelper.decodeToken(data.jwt);
            r.user = r.decoded.sub.usuario;
            r.setStorage('profile', r.decoded.sub.usuario);
            state.go('app');
        });
    };

}