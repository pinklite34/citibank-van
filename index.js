const axios = require('axios');
const { URLSearchParams } = require('url');

class VAN {
  constructor() {
    this.baseAxios = axios.create({
      baseURL: 'https://online.citi.com',
      withCredentials: true
    });
    this.api = {
      get: (...allParams) => this.baseAxios.get(...allParams).then(this.conformResponseToJSON()),
      post: (...allParams) => this.baseAxios.post(...allParams).then(this.conformResponseToJSON()),
      put: (...allParams) => this.baseAxios.put(...allParams).then(this.conformResponseToJSON()),
      del: (...allParams) => this.baseAxios.del(...allParams).then(this.conformResponseToJSON()),
    };
    this.creditCards = [];
    this.MsgNo = 0;
  }
  conformResponseToJSON() {
    return (results) => {
      const parsedResults = new URLSearchParams(results.data);
      function keyShouldBeReturned(key) {
        return key !== 'Dummy' && key !== 'Eof' && key !== 'Action' && key !== 'SessionId' && key !== 'Indicator';
      };
      const data = {};
      parsedResults.forEach((value, key) => {
        if (keyShouldBeReturned(key)) {
          data[key] = value;
        }
        if (key === 'SessionId') {
          this.sessionId = value;
        }
      });
      if (data.ErrMsg) {
        throw data;
      }
      return data;
    };
  }
  getCookies() {
    return this.api.get('/US/VAN/webcard/ranwebcard.jsp?brand=Citi&slim=true');
  }
  login(username, password) {
    this.username = username;
    this.password = password;
    return this.getCookies()
      .then(() =>
        this.api.post('/Athena/WebServlet', `SubEvent=login&Request=Authentication&CyotahttpAcceptEncoding=gzip&VirtualAcctVersion=DOWNLOAD&Password=${password}&CyotahttpAcceptLanguage=en%2DUS&WebcardType=SLIM&IssuerId=1&User=${username}&CyotahttpReferrer=&Locale=en&CyotaIPAddress=24%2E170%2E200%2E80&iOvationBlackbox=0400nyhffR%25252BvPCUNf94lis1ztslx6CM6kh71EwmdU5pwECEO41dOg52P6CTlL%25252FqCwCuqnCA2AVXtfyB09goHrD3QuUK5xp%25252BHG9GE7tjCQkotdjQw5xWQZwLvBK3AVNJ9bSaWDIKINVrQrNLcRehbfBGuVyjwgbWqT2UANmXQ9ibaX8ENczN14q3lywh3sf2PehRXzxRh3xo8sP3xwUJvdekrQjmYH7238d1UhH63W0JS9EmFAlPKT0bZ0hatzkWpnWI7wTbkqlmBR5MF6EZzbXoGNN59HEXmMHxLwBvzVf%25252FkqtLd5LTcBxyXSOlqWhTCsvxKYuRKa4SnVmrDJHzHkD8s4INYU%25252FTI6xDHIk58X3QGmlnCzrg4rEj1eSa2WrIxc0W3ToPDFOCOlaWD7zl7KVjHLwrtlZ3ZPYc61DwawH2AMLQpTOKngml6yQZLhqCKRUOm0Zo3B7DT%25252FkGDRtHpihj4KszV7Y8%25252FQweFQh28S34xskSFa2zpuxtfRg4mmYKxVbRr77A%25252FAHthzIQI07p4tGGHBe8mR20%25252FoWqfhp3GWZvlfT%25252FAqvQx%25252F6iBZk5svk%25252FNHrqcjqV%25252BOFA9iMjnGPNiEGe7m9T16TeM5diEHf7WUtiodkRiAwV4KReA9a9GWlqeUVMzCriD8oT%25252F%25252FrUtH5CLMJiFqNsezWDjDReYZ3ickyxF24hP4ehBV15lxEJ9p9DAJOHN%25252BsnP9%25252BSWhwxVxvHWf%25252FuK445lNi%25252BcovQlQ6y%25252F%25252BXfUDxdOq87auE3RWwyPd429Hc3XdHevRMsQLV98QdbSEOzcFuJafdvdDoYMHj6A4Tcw%25252F50G6zloCUZZHzyeVqoVts3c7lsEFJXsZtNN9udxoITTbiz8nSCU2KD2n3qkM%25252B8stAl7efp%25252BNjoxvg7ycAS4aoAe%25252BOYeNGYFn8Zui1Avp7zeygF7dmSFCZofxesfxXV871ILuV2UGFOpoPjmHjRmBZ%25252FG%25252BhRusOQCRRHHveWpqXQBjvetIl8o4OkdnJhw%25252F5Aifauo6HA%25252FvCd7wG5ogZ6Ep%25252FKlKYu3FTTPsnmSBBWhu07LmRdt5U4CpewIj2qku3ZkvznZVzOB5EWm0d59HEXmMHxLwBvzVf%25252FkqtLd5LTcBxyXSOlqWhTCsvxKYuRKa4SnVmrDJHzHkD8s4INYU%25252FTI6xDHIk58X3QGmlnCzrg4rEj1eSa2WrIxc0W3ToPDFOCOlaVByXXGibnU2eshaHYP8Oq6k%25252BcVXJiV2yKAmeNHH6%25252Bw6rOWrpw5osjMuppps6EVPsV2goLTAJmfwZi66SN3VCpciUbvBtjVzyFa1hgRPq1u7tKABMFgHDpi9xvbGowz5SEky7szlxuESVq44NyGTZasfYs6ZVAotR3xVajijX%25252FolNaNWTFA98K1RZ7hgn53zo3l%25252B0b4vf7xh4aDM05YG1%25252FHe34vRamSkybNP%25252B3fQNqB1B9qRtrgJ79NlU99UoH2xklIc%25252Fw4WKV7Fr80sU7WXPzI6TmrPLx%25252BjAuRcSQpdLa5%25252F31hL1iiG6hM8L27AT1LPr7maXtSl2UmmkzwyBQB1XB6kCEXU1KksDScbq6F4grLRiMiVJIpn96N&CyotaDevicePrint=version%25253D2%252526pm%5Ffpua%25253Dmozilla%252F4%2E0%252520%252528compatible%25253B%252520msie%2525207%2E0%25253B%252520windows%252520nt%2525206%2E2%25253B%252520wow64%25253B%252520trident%252F7%2E0%25253B%252520%2Enet4%2E0e%25253B%252520%2Enet4%2E0c%25253B%252520%2Enet%252520clr%2525203%2E5%2E30729%25253B%252520%2Enet%252520clr%2525202%2E0%2E50727%25253B%252520%2Enet%252520clr%2525203%2E0%2E30729%252529%25257C4%2E0%252520%252528compatible%25253B%252520MSIE%2525207%2E0%25253B%252520Windows%252520NT%2525206%2E2%25253B%252520WOW64%25253B%252520Trident%252F7%2E0%25253B%252520%2ENET4%2E0E%25253B%252520%2ENET4%2E0C%25253B%252520%2ENET%252520CLR%2525203%2E5%2E30729%25253B%252520%2ENET%252520CLR%2525202%2E0%2E50727%25253B%252520%2ENET%252520CLR%2525203%2E0%2E30729%252529%25257CWin32%25257C0%25257Cx86%25257Cen%2DUS%25257C18739%252526pm%5Ffpsc%25253D32%25257C1920%25257C1080%25257C1080%252526pm%5Ffpsw%25253Dabk%25253D6%25252C3%25252C9600%25252C17415%25257Cdht%25253D11%25252C0%25252C9600%25252C18739%25257Cieh%25253D11%25252C0%25252C9600%25252C18739%25257Ciee%25253D6%25252C3%25252C9600%25252C18739%25257Cwmp%25253D12%25252C0%25252C9600%25252C18438%25257Cobp%25253D11%25252C0%25252C9600%25252C18739%25257Coex%25253D6%25252C3%25252C9600%25252C17415%252526pm%5Ffptz%25253D%2D4%252526pm%5Ffpln%25253Dlang%25253Den%2DUS%25257Csyslang%25253Den%2DUS%25257Cuserlang%25253Den%2DUS%252526pm%5Ffpjv%25253D1%252526pm%5Ffpco%25253D1%252526pm%5Ffpasw%25253D%252526pm%5Ffpan%25253DMicrosoft%252520Internet%252520Explorer%252526pm%5Ffpacn%25253DMozilla%252526pm%5Ffpol%25253Dtrue%252526pm%5Ffposp%25253D%252526pm%5Ffpup%25253D%252526pm%5Ffpsaw%25253D1920%252526pm%5Ffpspd%25253D%252526pm%5Ffpsbd%25253D0%252526pm%5Ffpsdx%25253D96%252526pm%5Ffpsdy%25253D96%252526pm%5Ffpslx%25253D96%252526pm%5Ffpsly%25253D96%252526pm%5Ffpsfse%25253Dtrue%252526pm%5Ffpsui%25253D0&CyotaDeviceTokenFSO=&CyotaUserAgent=Mozilla%25252F4%2E0%252B%252528compatible%25253B%252BMSIE%252B7%2E0%25253B%252BWindows%252BNT%252B6%2E2%25253B%252BWOW64%25253B%252BTrident%25252F7%2E0%25253B%252B%2ENET4%2E0E%25253B%252B%2ENET4%2E0C%25253B%252B%2ENET%252BCLR%252B3%2E5%2E30729%25253B%252B%2ENET%252BCLR%252B2%2E0%2E50727%25253B%252B%2ENET%252BCLR%252B3%2E0%2E30729%252529&CyotahttpAccept=%2A%25252F%2A&CyotaDeviceTokenCookie=1&CyotahttpAcceptChars=`)
      )
      .then(() => {
        return this.getCards();
      });
  }
  getCards() {
    return this.api.post('/Athena/WebServlet', `Password=${this.password}&Request=GetActiveCards&SessionId=${this.sessionId}&User=${this.username}&IssuerId=1&WebcardType=SLIM&Locale=en`)
      .then(results => {
        this.usersNumberOfCreditCards = Number(results.Total);
        for (let i = 1; i <= this.usersNumberOfCreditCards; i++) {
          this.creditCards.push({
            cardholdersName: results[`CardholderName${i}`],
            lastFourOfCardNumber: results[`PAN${i}`],
            cardNickName: results[`Nickname${i}`],
            defaultCard: results[`DefaultCard${i}`] === 'Y',
            VCardId: results[`VCardId${i}`],
            CardType: results[`CardType${i}`]
          });
        }
        return this.creditCards;
      });
  }
  getMsgNo() {
    this.MsgNo++;
    return this.MsgNo;
  }
  generateCard(card) {
    return this.api.post('/Athena/WebServlet', `Request=RANRisk&CyotahttpAcceptEncoding=gzip&VirtualAcctVersion=DOWNLOAD&OriginID=&CyotahttpAcceptLanguage=en%2DUS&Version=FLEXWEBCARD%2DCITI%5F4%5F0%5F547%5F0&VCardId=${card.VCardId}&CyotaDevicePrint=version%25253D2%252526pm%5Ffpua%25253Dmozilla%252F4%2E0%252520%252528compatible%25253B%252520msie%2525207%2E0%25253B%252520windows%252520nt%2525206%2E2%25253B%252520wow64%25253B%252520trident%252F7%2E0%25253B%252520%2Enet4%2E0e%25253B%252520%2Enet4%2E0c%25253B%252520%2Enet%252520clr%2525203%2E5%2E30729%25253B%252520%2Enet%252520clr%2525202%2E0%2E50727%25253B%252520%2Enet%252520clr%2525203%2E0%2E30729%252529%25257C4%2E0%252520%252528compatible%25253B%252520MSIE%2525207%2E0%25253B%252520Windows%252520NT%2525206%2E2%25253B%252520WOW64%25253B%252520Trident%252F7%2E0%25253B%252520%2ENET4%2E0E%25253B%252520%2ENET4%2E0C%25253B%252520%2ENET%252520CLR%2525203%2E5%2E30729%25253B%252520%2ENET%252520CLR%2525202%2E0%2E50727%25253B%252520%2ENET%252520CLR%2525203%2E0%2E30729%252529%25257CWin32%25257C0%25257Cx86%25257Cen%2DUS%25257C18739%252526pm%5Ffpsc%25253D32%25257C1920%25257C1080%25257C1080%252526pm%5Ffpsw%25253Dabk%25253D6%25252C3%25252C9600%25252C17415%25257Cdht%25253D11%25252C0%25252C9600%25252C18739%25257Cieh%25253D11%25252C0%25252C9600%25252C18739%25257Ciee%25253D6%25252C3%25252C9600%25252C18739%25257Cwmp%25253D12%25252C0%25252C9600%25252C18438%25257Cobp%25253D11%25252C0%25252C9600%25252C18739%25257Coex%25253D6%25252C3%25252C9600%25252C17415%252526pm%5Ffptz%25253D%2D4%252526pm%5Ffpln%25253Dlang%25253Den%2DUS%25257Csyslang%25253Den%2DUS%25257Cuserlang%25253Den%2DUS%252526pm%5Ffpjv%25253D1%252526pm%5Ffpco%25253D1%252526pm%5Ffpasw%25253D%252526pm%5Ffpan%25253DMicrosoft%252520Internet%252520Explorer%252526pm%5Ffpacn%25253DMozilla%252526pm%5Ffpol%25253Dtrue%252526pm%5Ffposp%25253D%252526pm%5Ffpup%25253D%252526pm%5Ffpsaw%25253D1920%252526pm%5Ffpspd%25253D%252526pm%5Ffpsbd%25253D0%252526pm%5Ffpsdx%25253D96%252526pm%5Ffpsdy%25253D96%252526pm%5Ffpslx%25253D96%252526pm%5Ffpsly%25253D96%252526pm%5Ffpsfse%25253Dtrue%252526pm%5Ffpsui%25253D0&CyotahttpReferrer=&SessionId=${this.sessionId}&iOvationBlackbox=0400nyhffR%25252BvPCUNf94lis1ztslx6CM6kh71EwmdU5pwECEO41dOg52P6CTlL%25252FqCwCuqnCA2AVXtfyB09goHrD3QuUK5xp%25252BHG9GE7tjCQkotdjQw5xWQZwLvBK3AVNJ9bSaWDIKINVrQrNLcRehbfBGuV3dYcifmtkxPNmXQ9ibaX8ENczN14q3lywh3sf2PehRXzxRh3xo8sP3xwUJvdekrQjmYH7238d1UhH63W0JS9EmFAlPKT0bZ0hatzkWpnWI7wTbkqlmBR5MF6EZzbXoGNN59HEXmMHxLwBvzVf%25252FkqtLd5LTcBxyXSOlqWhTCsvxKYuRKa4SnVmrDJHzHkD8s4INYU%25252FTI6xDHIk58X3QGmlnCzrg4rEj1eSa2WrIxc0W3ToPDFOCOlaWD7zl7KVjHLwrtlZ3ZPYc61DwawH2AMLQpTOKngml6yQZLhqCKRUOm0Zo3B7DT%25252FkGDRtHpihj4KszV7Y8%25252FQweFQh28S34xskSFa2zpuxtfRg4mmYKxVbRr77A%25252FAHthzIQI07p4tGGHBe8mR20%25252FoWqfhp3GWZvlfT%25252FAqvQx%25252F6iBZk5svk%25252FNHrqcwWvElLVZ9TI3wt1gJSvYqtT16TeM5diEHf7WUtiodkRiAwV4KReA9bnw5KaWZ4pwxKmKi0E5mbItH5CLMJiFqNsezWDjDReYZ3ickyxF24hP4ehBV15lxEJ9p9DAJOHN%25252BsnP9%25252BSWhwxVxvHWf%25252FuK445lNi%25252BcovQlQ6y%25252F%25252BXfUDxdOq87auE3RWwyPd429Hc3XdHevRMsQLV98QdbSEOzcFuJafdvdDoYMHj6A4Tcw%25252F50G6zloCUZZHzyeVqoVts3c7lsEFJXsZtNN9udxoITTbiz8nSCU2KD2n3qkM%25252B8stAl7efp%25252BNjoxvg7ycAS4aoAe%25252BOYeNGYFn8Zui1Avp7zeygF7dmSFCZofxesfxXV871ILuV2UGFOpoPjmHjRmBZ%25252FG%25252BhRusOQCRRHHveWpqXQBjvetIl8o4OkdnJhw%25252F5Aifauo6HA%25252FvCd7wG5ogZ6Ep%25252FKlKYu3FTTPsnmSBBWhu07LmRdt5U4CpewIj2qku3ZkvznZVzOB5EWm0d59HEXmMHxLwBvzVf%25252FkqtLd5LTcBxyXSOlqWhTCsvxKYuRKa4SnVmrDJHzHkD8s4INYU%25252FTI6xDHIk58X3QGmlnCzrg4rEj1eSa2WrIxc0W3ToPDFOCOlaVByXXGibnU2eshaHYP8Oq6k%25252BcVXJiV2yKAmeNHH6%25252Bw6iz6EaCFtwC6BHoC4lgrgEUQvvB9rpoBsiXN6n4slkSKc%25252FXUz3IPsvxZrWwOnRUCedIQCcOsuVGBxTT7WbryzK6ir3bqElBGMlq44NyGTZasfYs6ZVAotR3xVajijX%25252FolNaNWTFA98K1RZ7hgn53zo3l%25252B0b4vf7xh4aDM05YG1%25252FHe34vRamSkybNP%25252B3fQNqB1B9qRtrgJ79NlU99UoH2xklIc%25252Fw4WKV7Fr80sU7WXPzI6TmrPLx%25252BjAuRcSQpdLa5%25252F31hL1iiG6hM8L27AT1LPr7maXtSl2UmmkzwyBQB1XB6kCEXU1KksDScbq6F4grLRiMiVJIpn96N&CyotaIPAddress=24%2E170%2E200%2E80&CyotaDeviceTokenCookie=1&MsgNo=${this.getMsgNo()}&TypeOfVirtualAcct=VAN&CyotaDeviceTokenFSO=&CyotaUserAgent=Mozilla%25252F4%2E0%252B%252528compatible%25253B%252BMSIE%252B7%2E0%25253B%252BWindows%252BNT%252B6%2E2%25253B%252BWOW64%25253B%252BTrident%25252F7%2E0%25253B%252B%2ENET4%2E0E%25253B%252B%2ENET4%2E0C%25253B%252B%2ENET%252BCLR%252B3%2E5%2E30729%25253B%252B%2ENET%252BCLR%252B2%2E0%2E50727%25253B%252B%2ENET%252BCLR%252B3%2E0%2E30729%252529&CyotahttpAccept=%2A%25252F%2A&Locale=en&SubEvent=generate&IssuerId=1&USDAmt=&CardType=${card.CardType}&CyotahttpAcceptChars=`).then(() => {
      return this.api.post('/Athena/WebServlet', `CPNType=SP&Locale=en&Version=FLEXWEBCARD%2DCITI%5F4%5F0%5F547%5F0&VCardId=${card.VCardId}&SessionId=${this.sessionId}&Indicator=VANGen&WebcardType=SLIM&MsgNo=${this.getMsgNo()}&Request=GetCPN&IssuerId=1&CardType=${card.CardType}`).then(results2 => {
        console.log(results2);
      });
    });
  }
}

module.exports = VAN;
