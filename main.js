const app = new Vue ({
    el:'#app',
    data: {
        titulo: 'Dividir la Cuenta v2.1',
        id: 0,
        total: 0,
        totalPersona: 0,
        totalesVisible: false,
        entrada: {
            nombre: '',
            monto: '',
            concepto: '',
        },
        entradas: [],
        personas: [],
        ponenFinal: [],
        recibenFinal: [],
        ponen: [],
        reciben: [],
        errorNombre: false,
        errorMonto: false,
        expresionesRegulares: {
            nombre: /^[a-zA-Z]/,
            monto: /^[0-9]/,
            mail: /^[^@]+@[^@]+\.[a-zA-Z]/,
        },
    },
    methods: {
        agregarEntrada: function (){
            this.errorNombre = false;
            this.errorMonto= false;
            if (this.entrada.nombre.length > 3 && this.entrada.nombre.length < 30 && (this.expresionesRegulares.nombre.test(this.entrada.nombre)==true)) {
                if (this.entrada.monto > 0 && this.entrada.monto.length >= 1 && this.entrada.monto.length < 10 && (this.expresionesRegulares.monto.test(this.entrada.monto)==true)) {
                    this.entrada.nombre = this.entrada.nombre.charAt(0).toUpperCase()+this.entrada.nombre.slice(1);
                    entradaAux = {
                        nombre: this.entrada.nombre,
                        monto: this.entrada.monto,
                        concepto: this.entrada.concepto,
                    }
                    this.entradas.push(entradaAux);
                } else {
                    this.errorMonto = !this.errorMonto;
                };
            } else if(this.entrada.monto > 0 && this.entrada.monto.length >= 1 && this.entrada.monto.length < 10 && (this.expresionesRegulares.monto.test(this.entrada.monto)==true)){
                this.errorNombre = !this.errorNombre;
            }
            else {
                this.errorNombre = !this.errorNombre;
                this.errorMonto = !this.errorMonto;
            };
            this.entrada= {
                nombre: '',
                monto: '',
                concepto: '',
            };
        },
        totales: function (){
            this.totalesVisible = !this.totalesVisible;
        },
        dividirCuenta: function() {
            personas = [];
            for (i in this.entradas){
                if (!(personas.includes(this.entradas[i].nombre))){
                    personas.push(this.entradas[i].nombre);
                };
            };
            for (i in personas){
                total=0;
                personaFinal = {
                    id: i,
                    nombre: '',
                    puso: '',
                    pusoFinal: '',
                    pone: '',
                    poneFinal: '',
                };
                personaFinal.nombre = personas[i]; 
                for (x in this.entradas){
                    if(this.entradas[x].nombre == personas[i]){
                        total = total + parseInt(this.entradas[x].monto);
                    };
                };
                personaFinal.puso = total;
                personaFinal.pusoFinal = total;
                this.personas.push(personaFinal);
            };
            total = 0;
            for (i in this.personas) {
                total = total + parseInt(this.personas[i].puso);
            }
            this.total = this.total + total;
            this.totalPersona = parseInt(this.total/this.personas.length);
            if(this.totales.visible == false){
                this.totales();
            };
            for(i in this.personas) {
                this.personas[i].pone = (parseInt(this.totalPersona)) - parseInt(this.personas[i].puso);
                this.personas[i].poneFinal = (parseInt(this.totalPersona)) - parseInt(this.personas[i].puso);
            };
            let reciben = [];
            let ponen = [];
            for (i in this.personas){
                if(this.personas[i].pone > 0){
                    ponen.push(this.personas[i]);
                } else{
                    reciben.push(this.personas[i]);
                };
            };
            reciben.sort(function(a, b){return a - b});
            ponen.sort(function(a, b){return a - b});
            for (i in reciben){
                reciben[i].final = [];
            };
            for(i in ponen){
                ponen[i].final = [];
                for (x in reciben){
                    while (reciben[x].pone != 0 && ponen[i].pone != 0){
                        resto = reciben[x].pone + ponen[i].pone;
                        if (resto > 0) {
                            finalRecibe = {
                                nombre: ponen[i].nombre, 
                                monto: reciben[x].pone
                            };
                            finalPone = {
                                nombre: reciben[x].nombre,
                                monto: reciben[x].pone
                            };
                            reciben[x].final.push(finalRecibe);
                            ponen[i].pone = ponen[i].pone + reciben[x].pone;
                            ponen[i].final.push(finalPone);
                            reciben[x].pone = reciben[x].pone + reciben[x].pone;
                        } else if(resto < 0) {
                            finalPone = {
                                nombre: reciben[x].nombre,
                                monto: ponen[i].pone,
                            };
                            finalRecibe = {
                                nombre: ponen[i].nombre,
                                monto: ponen[i].pone,
                            };
                            ponen[i].final.push(finalPone);
                            reciben[x].final.push(finalRecibe);
                            reciben[x].pone = reciben[x].pone + ponen[i].pone;
                            ponen[i].pone = ponen[i].pone -ponen[i].pone;
                        } else if (resto == 0){
                            finalReciben = {
                                nombre: ponen[i].nombre,
                                monto: reciben[x].pone
                            };
                            finalPonen = {
                                nombre: reciben[x].nombre,
                                monto: ponen[i].pone
                            };
                            reciben[x].final.push(finalReciben);
                            ponen[i].final.push(finalPonen);
                            ponen[i].pone = ponen[i].pone - ponen[i].pone;
                            reciben[x].pone = reciben[x].pone + reciben[x].pone;
                        };
                    };
                };
            };
            for(i in reciben){
                this.reciben.push(reciben[i]);
            };
            for(i in ponen){
                this.ponen.push(ponen[i]);
            };
        },
        reiniciar: function () {
            this.total= 0;
            this.totalPersona= 0;
            this.totalesVisible= false;
            this.entrada= {
                nombre: '',
                monto: '',
                concepto: '',
            };
            this.entradas= [];
            this.personas= [];
            this.ponenFinal= [];
            this.recibenFinal= [];
            this.ponen= [];
            this.reciben= [];
            this.errorNombre= false;
            this.errorMonto= false;
        },
        //borrarEntrada: function () {
        //    console.log(this.id);
        //}
    },
})