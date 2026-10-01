import React,{useState} from 'react';
import { View, Text, TextInput, StyleSheet, ScrollView, Pressable } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button } from '../components/ui';
import { api } from '../services/api';
import { colors, radius } from '../theme';
export function Welcome({navigation}:any){return <LinearGradient colors={['#1D5BE0','#0B3BB8']} style={{flex:1}}><SafeAreaView style={{flex:1,padding:24}}>
 <View style={{width:36,height:24,borderRadius:3,overflow:'hidden',flexDirection:'row'}}><View style={{flex:1,backgroundColor:'#F77F00'}}/><View style={{flex:1,backgroundColor:'#fff'}}/><View style={{flex:1,backgroundColor:'#009E60'}}/></View>
 <View style={{flex:1,alignItems:'center',justifyContent:'center'}}><Ionicons name="school" size={150} color="#fff"/></View>
 <Text style={{color:'#fff',fontSize:24,fontWeight:'800',textAlign:'center',lineHeight:30}}>Apprendre aujourd'hui{'\n'}pour construire demain</Text>
 <Text style={{color:'#DBEAFE',textAlign:'center',marginVertical:14,fontSize:12,lineHeight:18}}>Application éducative complète pour tous les élèves de Côte d'Ivoire du CP à Terminale.</Text>
 <Button variant="white" title="Commencer" onPress={()=>navigation.navigate('Register')}/><View style={{height:10}}/><Button variant="outline" title="Se connecter" onPress={()=>navigation.navigate('Login')}/></SafeAreaView></LinearGradient>;}
export function Login({navigation}:any){const [e,setE]=useState('');const [p,setP]=useState('');const [busy,setBusy]=useState(false);const [show,setShow]=useState(false);const [rem,setRem]=useState(true);
 const go=async()=>{setBusy(true);const u=await api.login(e,p);setBusy(false);navigation.replace(u.role==='admin'?'Admin':'Main');};
 return <SafeAreaView style={{flex:1,backgroundColor:'#fff'}}><ScrollView contentContainerStyle={{padding:24}} keyboardShouldPersistTaps="handled">
  <View style={{alignItems:'center',marginVertical:20}}><Ionicons name="book" size={56} color={colors.primary}/>
   <Text style={{fontSize:34,fontWeight:'800',color:'#1E3A8A'}}>Edu<Text style={{color:colors.orange}}>CI</Text></Text><Text style={{color:colors.primary,fontSize:12}}>Apprendre • Réussir • Grandir</Text></View>
  <Text style={s.l}>Adresse e-mail ou numéro</Text><TextInput style={s.i} value={e} onChangeText={setE} autoCapitalize="none" placeholder="exemple@domaine.com" placeholderTextColor="#94A3B8"/>
  <Text style={s.l}>Mot de passe</Text><View><TextInput style={s.i} value={p} onChangeText={setP} secureTextEntry={!show} placeholder="Votre mot de passe" placeholderTextColor="#94A3B8"/>
   <Pressable onPress={()=>setShow(!show)} style={{position:'absolute',right:14,top:14}}><Ionicons name={show?'eye-off':'eye'} size={20} color={colors.muted}/></Pressable></View>
  <View style={{flexDirection:'row',justifyContent:'space-between',alignItems:'center',marginBottom:16}}>
   <Pressable onPress={()=>setRem(!rem)} style={{flexDirection:'row',alignItems:'center',gap:8}}><Ionicons name={rem?'checkbox':'square-outline'} size={20} color={colors.primary}/><Text style={{fontSize:12}}>Se souvenir de moi</Text></Pressable>
   <Text style={{color:colors.primary,fontSize:12}} onPress={()=>navigation.navigate('Forgot')}>Mot de passe oublié ?</Text></View>
  <Button title={busy?'Connexion…':'Se connecter'} onPress={go}/>
  <Text style={{textAlign:'center',color:colors.muted,fontSize:12,marginVertical:18}}>Ou se connecter avec</Text>
  <View style={{flexDirection:'row',gap:10}}>{([['logo-google','Google','#EA4335'],['logo-facebook','Facebook','#1877F2']] as const).map(([i,l,c])=><View key={l} style={[s.so]}><Ionicons name={i} size={20} color={c}/><Text style={{fontSize:13}}>{l}</Text></View>)}</View>
  <Text style={{textAlign:'center',marginTop:24,color:colors.muted,fontSize:12}}>Vous n'avez pas de compte ? <Text style={{color:colors.primary}} onPress={()=>navigation.navigate('Register')}>Inscrivez-vous</Text></Text></ScrollView></SafeAreaView>;}
function Form({fields,cta,onSubmit,done}:{fields:[string,boolean][];cta:string;onSubmit:(v:string[])=>Promise<any>;done:string}){
 const [v,setV]=useState<string[]>(fields.map(()=>''));const [msg,setMsg]=useState('');const [busy,setBusy]=useState(false);
 const go=async()=>{if(v.some(x=>!x.trim()))return setMsg('Remplis tous les champs.');setBusy(true);await onSubmit(v);setBusy(false);setMsg(done);};
 return <SafeAreaView style={{flex:1,backgroundColor:'#fff'}}><ScrollView contentContainerStyle={{padding:24}} keyboardShouldPersistTaps="handled">
  {fields.map(([l,secret],i)=><View key={l}><Text style={s.l}>{l}</Text><TextInput style={s.i} secureTextEntry={secret} autoCapitalize="none" value={v[i]} onChangeText={t=>setV(v.map((x,j)=>j===i?t:x))}/></View>)}
  {!!msg&&<Text style={{color:msg===done?colors.green:colors.red,marginBottom:12}}>{msg}</Text>}<Button title={busy?'Envoi…':cta} onPress={go}/></ScrollView></SafeAreaView>;}
export const Register=({navigation}:any)=><Form fields={[['Nom complet',false],['Adresse e-mail ou numéro',false],['Mot de passe',true]]} cta="Créer mon compte" done="Compte créé. Tu peux te connecter." onSubmit={v=>api.register(v[0],v[1],v[2]).then(()=>setTimeout(()=>navigation.replace('Login'),800))}/>;
export const Forgot=()=><Form fields={[['Adresse e-mail ou numéro',false]]} cta="Envoyer le lien" done="Lien de réinitialisation envoyé." onSubmit={v=>api.reset(v[0])}/>;
const s=StyleSheet.create({so:{flex:1,height:46,borderWidth:1,borderColor:colors.border,borderRadius:radius.md,flexDirection:'row',alignItems:'center',justifyContent:'center',gap:8},l:{fontSize:13,marginBottom:6,color:colors.text},i:{height:48,borderWidth:1,borderColor:colors.border,borderRadius:radius.md,paddingHorizontal:14,marginBottom:14}});
