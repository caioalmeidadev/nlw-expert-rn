import { Text, View, ScrollView, Alert, Linking } from "react-native";
import { Header } from "@/components/header";
import { Product } from "@/components/product";
import { ProductCartProps, useCartStore } from "@/stores/cart-store";
import { formatCurreny } from "@/utils/functions/format-currenry";
import { Input } from "@/components/input";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { Button } from "@/components/button";
import { Feather } from "@expo/vector-icons";
import { LinkButton } from "@/components/link-button";
import { useState } from "react";
import { useNavigation } from "expo-router";

const PHONE_NUMBER = '5569xxxxxxxxxx'

export default function Cart(){
    const cartStore = useCartStore()
    const [address, setAddress] = useState('')
    const navigation = useNavigation()

    const total = formatCurreny(cartStore.products.reduce((total,product) => total + product.price * product.quantity, 0))

    function handleProductRemove(product:ProductCartProps){
        Alert.alert('Remover', `Deseja remover ${product.title} do carrinho?`,[{
            text: 'Cancelar'
        },{text: 'Remover', onPress: () => cartStore.remove(product.id)}])
    }

    function handleOrder(){
        if(address.trim().length === 0) return Alert.alert('Pedido','Informe os dados da entrega.')
        
        const products = cartStore.products.map(product => `\n ${product.quantity} ${product.title}`).join("")

        const message = `
            Novo Pedido
            \n Entregar em ${address}

            ${products}

            \n Valor Total: ${total}
        `

        Linking.openURL(`whatsapp://send?phone=${PHONE_NUMBER}&text=${message}`)
        cartStore.clear()
        navigation.goBack()

    }
    return <View className="flex-1 pt-8">
        <Header title='Seu Carrinho'/>
        <KeyboardAwareScrollView>
            <ScrollView>
                <View className="p-5 flex-1">
        {cartStore.products.length > 0 ?
            <View className="border-b border-slate-700">
                {cartStore.products.map(product => <Product key={product.id} data={product} onPress={() => handleProductRemove(product)}/>)}
            </View>
        :
            <Text className="font-body text-slate-400 text-center my-8">Seu carrinho está vazio</Text>
        }

        <View className="flex-row gap-2 items-center mt-5 mb-4">
            <Text className="text-white text-xl font-subtitle">Total:</Text>
            <Text className="text-lime-400 text-2xl font-heading">{total}</Text>
        </View>

        <Input placeholder="Informe o endereço de entrega" onChangeText={setAddress} onSubmitEditing={handleOrder} blurOnSubmit={true} returnKeyType="next" />
        </View>
        </ScrollView>
        </KeyboardAwareScrollView>
        <View className="p-5 gap-5">
            <Button>
                <Button.Text>Enviar pedido</Button.Text>
                <Button.Icon><Feather name="arrow-right" size={20} /></Button.Icon>
            </Button>
            <LinkButton title="Voltar ao cardápio" href='/'/>
        </View>
    </View>
}