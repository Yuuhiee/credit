﻿import { jsPDF } from 'jspdf'

const callAddFont = function () {
  this.addFileToVFS('ZiTiQuanWeiJunHei-W1-2-normal.ttf', font)
  this.addFont('ZiTiQuanWeiJunHei-W1-2-normal.ttf', 'ZiTiQuanWeiJunHei-W1-2', 'normal')
}
jsPDF.API.events.push(['addFonts', callAddFont])