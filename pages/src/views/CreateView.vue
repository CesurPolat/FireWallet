<script>
    window.API.ResizeWindow(800,600);
    export default {
        data:function(){
            return{
                show: 'create',
                pass:'',
                confirmPass:'',
            };
        }
    };
</script>

<template>
    <div class="flex flex-col p-5" >
    <div class="flex flex-col items-center" v-show="show=='create'">
        <h1 class="font-bold">New to FIREWALLET?</h1><br>
        <div class="flex">
            <div class="border-gray-300 border rounded m-2">
                <button class="bg-red-500 text-white w-32 m-5 p-2 rounded-full" @click="show='password'">Create a Wallet</button>
            </div>
            <div class="border-gray-300 border rounded m-2">
                <button class="bg-red-500 text-white w-32 m-5 p-2 rounded-full" @click="show='import'">Import Wallet</button>
            </div>
        </div>
    </div>

    <div class="flex flex-col items-center" v-show="show=='password'">
        <a @click="show='create'" class="text-left w-64">← Back</a>
        <h1>Create Password</h1>
        <input type="password" v-model="pass" class="border rounded-full p-2 pl-5 pr-5 w-64 focus:border-red-500 outline-none transition-all">
        <h1>Repassword</h1>
        <input type="password" v-model="confirmPass" class="border rounded-full p-2 pl-5 pr-5 w-64 focus:border-red-500 outline-none transition-all">
        <button class="bg-red-500 text-white w-64 m-5 p-2 rounded-full" >Create Password</button>
    </div>

    <div class="flex flex-col items-center" v-show="show=='import'">
        <a @click="show='create'" class="text-left w-64">← Back</a>
        <div class="flex flex-wrap w-96">
            <p>1<input type="text" class="border w-32"></p>
            <p>2<input type="text" class="border w-32"></p>
            <p>3<input type="text" class="border w-32"></p>
            <p>4<input type="text" class="border w-32"></p>
            <p>5<input type="text" class="border w-32"></p>
            <p>6<input type="text" class="border w-32"></p>
            <p>7<input type="text" class="border w-32"></p>
            <p>8<input type="text" class="border w-32"></p>
            <p>9<input type="text" class="border w-32"></p>
            <p>10<input type="text" class="border w-32"></p>
            <p>11<input type="text" class="border w-32"></p>
            <p>12<input type="text" class="border w-32"></p>
        </div>
    </div>
</div>
</template>
