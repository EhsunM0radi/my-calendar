import momentJ from 'moment-jalaali'
import momentH from 'moment-hijri'

// تعریف انواع مناسبت‌ها
export interface Occasion {
  title: string
  type: 'national' | 'religious' | 'international' | 'custom'
  isHoliday: boolean // آیا تعطیل رسمی است؟
}

// مناسبت‌های تقویم میلادی (ماه/روز)
export const gregorianOccasions: Record<string, Occasion[]> = {
   // ژانویه
  '01-01': [{ title: 'سال نو میلادی', type: 'international', isHoliday: false }],
  '01-04': [{ title: 'روز جهانی بریل (World Braille Day)', type: 'international', isHoliday: false }],
  '01-24': [{ title: 'روز بین‌المللی آموزش', type: 'international', isHoliday: false }],
  '01-27': [{ title: 'روز یادبود قربانیان هولوکاست', type: 'international', isHoliday: false }],

  // فوریه
  '02-04': [{ title: 'روز بین‌المللی برادری انسانی / مبارزه با سرطان (اگر ترکیب شده)', type: 'international', isHoliday: false }],
  '02-06': [{ title: 'روز بین‌المللی نه به ختنهٔ زنان', type: 'international', isHoliday: false }],
  '02-10': [{ title: 'روز جهانی حبوبات (World Pulses Day)', type: 'international', isHoliday: false }],
  '02-11': [{ title: 'روز جهانی زنان و دختران در علم', type: 'international', isHoliday: false }],
  '02-13': [{ title: 'روز جهانی رادیو', type: 'international', isHoliday: false }],
  '02-20': [{ title: 'روز جهانی عدالت اجتماعی', type: 'international', isHoliday: false }],
  '02-21': [{ title: 'روز جهانی زبان مادری', type: 'international', isHoliday: false }],

  // مارس
  '03-01': [{ title: 'روز جهانی دریاچمن‌ها (World Seagrass Day)', type: 'international', isHoliday: false },
           { title: 'روز تبعیض‌زدایی (Zero Discrimination Day)', type: 'international', isHoliday: false }],
  '03-03': [{ title: 'روز جهانی حیات‌وحش', type: 'international', isHoliday: false }],
  '03-08': [{ title: 'روز جهانی زن', type: 'international', isHoliday: false }],
  '03-10': [{ title: 'روز جهانی قضات زن', type: 'international', isHoliday: false }],
  '03-15': [{ title: 'روز بین‌المللی مبارزه با اسلام‌ستیزی', type: 'international', isHoliday: false }],
  '03-20': [
    { title: 'روز جهانی شادی', type: 'international', isHoliday: false },
    { title: 'روز زبان فرانسه', type: 'international', isHoliday: false }
  ],
  '03-21': [
    { title: 'روز جهانی جنگل‌ها', type: 'international', isHoliday: false },
    { title: 'روز بین‌المللی نوروز', type: 'international', isHoliday: false },
    { title: 'روز بین‌المللی رفع تبعیض نژادی', type: 'international', isHoliday: false },
    { title: 'روز جهانی شعر (UNESCO)', type: 'international', isHoliday: false }
  ],
  '03-22': [{ title: 'روز جهانی آب', type: 'international', isHoliday: false }],
  '03-23': [
    { title: 'روز جهانی هواشناسی (World Meteorological Day)', type: 'international', isHoliday: false },
    { title: 'روز جهانی سل (World TB Day)', type: 'international', isHoliday: false },
    { title: 'روز حق حقیقت و کرامت (Right to the Truth Day)', type: 'international', isHoliday: false }
  ],
  '03-25': [
    { title: 'روز یادبود تجارت برده و برده‌داری (Transatlantic Slave Trade Remembrance Day)', type: 'international', isHoliday: false },
    { title: 'روز همبستگی با کارکنان بازداشت شده / مفقود (Missing Staff Members Day)', type: 'international', isHoliday: false }
  ],
  '03-30': [{ title: 'روز جهانی پسماند صفر (Zero Waste Day)', type: 'international', isHoliday: false }],

  // آوریل
  '04-02': [{ title: 'روز جهانی اوتیسم', type: 'international', isHoliday: false }],
  '04-04': [{ title: 'روز آگاهی مین‌گذاری (Mine Awareness Day)', type: 'international', isHoliday: false }],
  '04-05': [{ title: 'روز بین‌المللی وجدان (International Day of Conscience)', type: 'international', isHoliday: false }],
  '04-06': [{ title: 'روز ورزش برای توسعه و صلح', type: 'international', isHoliday: false }],
  '04-07': [
    { title: 'روز جهانی بهداشت', type: 'international', isHoliday: false },
    { title: 'روز یادبود قربانیان نسل‌کشی رواندا', type: 'international', isHoliday: false }
  ],
  '04-12': [{ title: 'روز بین‌المللی پرواز فضایی انسان (Human Space Flight Day)', type: 'international', isHoliday: false }],
  '04-14': [{ title: 'روز جهانی بیماری چاگاس', type: 'international', isHoliday: false }],
  '04-20': [{ title: 'روز زبان چینی', type: 'international', isHoliday: false },
           { title: 'روز خلاقیت و نوآوری جهانی', type: 'international', isHoliday: false }],
  '04-21': [
    { title: 'روز مادر زمین (Earth Day)', type: 'international', isHoliday: false },
    { title: 'روز بین‌المللی چندجانبه‌گرایی و دیپلماسی برای صلح', type: 'international', isHoliday: false }
  ],
  '04-22': [{ title: 'روز جهانی زمین', type: 'international', isHoliday: false }],
  '04-23': [
    { title: 'روز جهانی کتاب و کپی‌رایت', type: 'international', isHoliday: false },
    { title: 'روز زبان انگلیسی / اسپانیایی', type: 'international', isHoliday: false }
  ],
  '04-24': [
    { title: 'روز اطلاع‌رسانی توسعه جهانی', type: 'international', isHoliday: false },
    { title: 'روز چندجانبه‌گرایی و دیپلماسی برای صلح', type: 'international', isHoliday: false }
  ],
  '04-25': [
    { title: 'روز دختران در فناوری اطلاعات (Girls in ICT Day)', type: 'international', isHoliday: false },
    { title: 'روز جهانی مالاریا', type: 'international', isHoliday: false }
  ],
  '04-26': [
    { title: 'روز جهانی مالکیت فکری (IP Day)', type: 'international', isHoliday: false },
    { title: 'روز یادبود حادثه چرنوبیل', type: 'international', isHoliday: false }
  ],
  '04-28': [{ title: 'روز جهانی ایمنی و سلامت در محیط کار', type: 'international', isHoliday: false }],
  '04-30': [{ title: 'روز جهانی جاز (International Jazz Day)', type: 'international', isHoliday: false }],

  // مه / می
  '05-02': [{ title: 'روز جهانی تون (World Tuna Day)', type: 'international', isHoliday: false }],
  '05-03': [{ title: 'روز جهانی آزادی مطبوعات', type: 'international', isHoliday: false }],
  '05-05': [{ title: 'روز زبان پرتغالی (World Portuguese Language Day)', type: 'international', isHoliday: false }],
  '05-08': [{ title: 'روز یادبود جنگ جهانی دوم', type: 'international', isHoliday: false }],
  '05-15': [{ title: 'روز جهانی خانواده', type: 'international', isHoliday: false }],
  '05-16': [
    { title: 'روز بین‌المللی زندگی با هم در صلح (Living Together in Peace Day)', type: 'international', isHoliday: false },
    { title: 'روز بین‌المللی نور (International Day of Light)', type: 'international', isHoliday: false }
  ],
  '05-17': [{ title: 'روز جهانی ارتباطات و جامعه اطلاعاتی (World Telecommunication & Information Society Day)', type: 'international', isHoliday: false }],
  '05-20': [{ title: 'روز جهانی زنبورها', type: 'international', isHoliday: false }],
  '05-21': [{ title: 'روز تنوع فرهنگی برای گفت‌وگو و توسعه', type: 'international', isHoliday: false }],
  '05-22': [{ title: 'روز جهانی تنوع زیستی (Biological Diversity Day)', type: 'international', isHoliday: false }],
  '05-23': [{ title: 'روز بین‌المللی پایان فیستول زایمان', type: 'international', isHoliday: false }],
  '05-29': [{ title: 'روز بین‌المللی حافظان صلح سازمان ملل', type: 'international', isHoliday: false }],
  '05-31': [{ title: 'روز جهانی بدون دخانیات', type: 'international', isHoliday: false }],

  // ژوئن
  '06-01': [{ title: 'روز جهانی والدین (Global Day of Parents)', type: 'international', isHoliday: false }],
  '06-03': [{ title: 'روز جهانی دوچرخه (World Bicycle Day)', type: 'international', isHoliday: false }],
  '06-04': [
    { title: 'روز بین‌المللی کودکان بی‌گناه قربانی (Innocent Children Victims Day)', type: 'international', isHoliday: false },
    { title: 'روز ایمنی غذایی جهانی (World Food Safety Day)', type: 'international', isHoliday: false }
  ],
  '06-05': [{ title: 'روز جهانی محیط زیست', type: 'international', isHoliday: false }],
  '06-07': [{ title: 'روز بین‌المللی پرورشگاه‌ها (International Day of Cooperatives) — اگر ثابت', type: 'international', isHoliday: false }],
  '06-08': [{ title: 'روز جهانی اقیانوس‌ها', type: 'international', isHoliday: false }],
  '06-11': [{ title: 'روز بین‌المللی بازی (International Day of Play)', type: 'international', isHoliday: false }],
  '06-12': [{ title: 'روز جهانی مبارزه با کار کودک', type: 'international', isHoliday: false }],
  '06-14': [{ title: 'روز جهانی اهدای خون', type: 'international', isHoliday: false }],
  '06-15': [{ title: 'روز آگاهی از سوء استفاده از سالمندان', type: 'international', isHoliday: false }],
  '06-17': [{ title: 'روز جهانی مقابله با بیابان‌زایی و خشکسالی', type: 'international', isHoliday: false }],
  '06-18': [{ title: 'روز تغذیه پایدار (Sustainable Gastronomy Day)', type: 'international', isHoliday: false }],
  '06-19': [{ title: 'روز جهانی حذف خشونت جنسی در درگیری‌ها', type: 'international', isHoliday: false }],
  '06-20': [{ title: 'روز جهانی پناهندگان', type: 'international', isHoliday: false }],
  '06-21': [
    { title: 'روز جهانی یوگا', type: 'international', isHoliday: false },
    { title: 'روز جشن انقلاب تابستانی (Solstice Celebration Day)', type: 'international', isHoliday: false }
  ],
  '06-23': [
    { title: 'روز خدمات عمومی سازمان ملل (Public Service Day)', type: 'international', isHoliday: false },
    { title: 'روز بین‌المللی کشتگان (Widows Day)', type: 'international', isHoliday: false }
  ],
  '06-25': [{ title: 'روز دریا‌نورد (Day of the Seafarer)', type: 'international', isHoliday: false }],
  '06-26': [
    { title: 'روز جهانی مبارزه با مواد مخدر', type: 'international', isHoliday: false },
    { title: 'روز بین‌المللی حمایت از قربانیان شکنجه', type: 'international', isHoliday: false }
  ],
  '06-27': [{ title: 'روز جهانی کسب‌وکارهای کوچک و متوسط', type: 'international', isHoliday: false }],
  '06-29': [{ title: 'روز جهانی مناطق گرمسیری (International Day of the Tropics)', type: 'international', isHoliday: false }],
  '06-30': [
    { title: 'روز جهانی سیارات کوچک (Asteroid Day)', type: 'international', isHoliday: false },
    { title: 'روز بین‌المللی پارلمان‌گرایی', type: 'international', isHoliday: false }
  ],

  // جولای
  '07-06': [{ title: 'روز بین‌المللی تعاون (International Day of Cooperatives)', type: 'international', isHoliday: false }],
  '07-07': [{ title: 'روز زبان کسواحیلی (Kiswahili Language Day)', type: 'international', isHoliday: false }],
  '07-11': [{ title: 'روز جهانی جمعیت', type: 'international', isHoliday: false }],
  '07-12': [{ title: 'روز مبارزه با طوفان گرد و غبار (Combating Sand and Dust Storms Day)', type: 'international', isHoliday: false }],
  '07-15': [{ title: 'روز مهارت‌های جوانان جهانی', type: 'international', isHoliday: false }],
  '07-18': [{ title: 'روز بین‌المللی نلسون ماندلا', type: 'international', isHoliday: false }],
  '07-20': [
    { title: 'روز جهانی شطرنج', type: 'international', isHoliday: false },
    { title: 'روز بین‌المللی ماه (Moon Day)', type: 'international', isHoliday: false }
  ],
  '07-25': [
    { title: 'روز پیشگیری غرق شدن (Drowning Prevention Day)', type: 'international', isHoliday: false },
    { title: 'روز بین‌المللی زنان و دختران آفریقایی (Women of African Descent Day)', type: 'international', isHoliday: false }
  ],
  '07-28': [{ title: 'روز جهانی هپاتیت', type: 'international', isHoliday: false }],
  '07-30': [
    { title: 'روز بین‌المللی دوستی', type: 'international', isHoliday: false },
    { title: 'روز جهانی مبارزه با قاچاق انسان', type: 'international', isHoliday: false }
  ],

  // اوت / آگوست
  '08-01': [{ title: 'هفته جهانی تغذیه با شیر مادر (۱–۷ اوت)', type: 'international', isHoliday: false }],
  '08-09': [{ title: 'روز بین‌المللی بومیان جهان', type: 'international', isHoliday: false }],
  '08-11': [{ title: 'روز جهانی آهنگ‌سازی / استیل‌پن (World Steelpan Day)', type: 'international', isHoliday: false }],
  '08-12': [{ title: 'روز جهانی جوانان', type: 'international', isHoliday: false }],
  '08-19': [{ title: 'روز انسانی بین‌المللی', type: 'international', isHoliday: false }],
  '08-21': [{ title: 'روز یادبود قربانیان تروریسم', type: 'international', isHoliday: false }],
  '08-22': [{ title: 'روز یادبود قربانیان خشونت بر اساس دین یا باور', type: 'international', isHoliday: false }],
  '08-23': [{ title: 'روز یادبود تجارت برده و لغو آن', type: 'international', isHoliday: false }],
  '08-29': [{ title: 'روز بین‌المللی مقابله با آزمایش‌های هسته‌ای', type: 'international', isHoliday: false }],
  '08-30': [{ title: 'روز بین‌المللی قربانیان ناپدیدشدگان اجباری', type: 'international', isHoliday: false }],
  '08-31': [{ title: 'روز بین‌المللی مردم آفریقایی تبار', type: 'international', isHoliday: false }],

  // سپتامبر
  '09-05': [{ title: 'روز بین‌المللی خیریه', type: 'international', isHoliday: false }],
  '09-07': [
    { title: 'روز بین‌المللی همکاری پلیس', type: 'international', isHoliday: false },
    { title: 'روز هوای پاک برای آسمان آبی', type: 'international', isHoliday: false }
  ],
  '09-08': [{ title: 'روز جهانی سواد', type: 'international', isHoliday: false }],
  '09-09': [{ title: 'روز بین‌المللی محافظت از آموزش در مواجهه با حمله', type: 'international', isHoliday: false }],
  '09-12': [{ title: 'روز همکاری جنوب-جنوب', type: 'international', isHoliday: false }],
  '09-15': [{ title: 'روز جهانی دموکراسی', type: 'international', isHoliday: false }],
  '09-16': [{ title: 'روز حفظ لایه ازون', type: 'international', isHoliday: false }],
  '09-17': [{ title: 'روز ایمنی بیمار (World Patient Safety Day)', type: 'international', isHoliday: false }],
  '09-18': [{ title: 'روز برابری حقوق (Equal Pay Day)', type: 'international', isHoliday: false }],
  '09-20': [{ title: 'روز جهانی پاک‌سازی (World Cleanup Day)', type: 'international', isHoliday: false }],
  '09-21': [{ title: 'روز جهانی صلح', type: 'international', isHoliday: false }],
  '09-23': [{ title: 'روز زبان‌های اشاره', type: 'international', isHoliday: false }],
  '09-25': [{ title: 'روز دریانوردی جهانی', type: 'international', isHoliday: false }],
  '09-26': [{ title: 'روز بین‌المللی حذف کامل سلاح‌های هسته‌ای', type: 'international', isHoliday: false }],
  '09-27': [{ title: 'روز جهانی گردشگری', type: 'international', isHoliday: false }],
  '09-28': [{ title: 'روز دسترسی جهانی به اطلاعات', type: 'international', isHoliday: false }],
  '09-29': [{ title: 'روز آگاهی از هدررفت غذا', type: 'international', isHoliday: false }],
  '09-30': [{ title: 'روز ترجمه بین‌المللی', type: 'international', isHoliday: false }],

  // اکتبر
  '10-01': [{ title: 'روز جهانی سالمندان', type: 'international', isHoliday: false }],
  '10-02': [{ title: 'روز بین‌المللی عدم خشونت', type: 'international', isHoliday: false }],
  '10-04': [{ title: 'هفته جهانی فضا (۴–۱۰ اکتبر)', type: 'international', isHoliday: false }],
  '10-05': [{ title: 'روز جهانی معلم', type: 'international', isHoliday: false }],
  '10-06': [{ title: 'روز جهانی مسکن (World Habitat Day)', type: 'international', isHoliday: false }],
  '10-07': [
    { title: 'روز جهانی محیط‌زیست شهری (World Habitat Day)', type: 'international', isHoliday: false },
    { title: 'روز جهانی پنبه (World Cotton Day)', type: 'international', isHoliday: false }
  ],
  '10-09': [{ title: 'روز جهانی پست', type: 'international', isHoliday: false }],
  '10-10': [{ title: 'روز جهانی سلامت روان', type: 'international', isHoliday: false }],
  '10-11': [
    { title: 'روز جهانی پرندگان مهاجر', type: 'international', isHoliday: false },
    { title: 'روز بین‌المللی دختر (International Day of the Girl Child)', type: 'international', isHoliday: false }
  ],
  '10-13': [{ title: 'روز بین‌المللی کاهش بلایای طبیعی', type: 'international', isHoliday: false }],
  '10-15': [{ title: 'روز بین‌المللی زنان روستایی', type: 'international', isHoliday: false }],
  '10-16': [{ title: 'روز جهانی غذا', type: 'international', isHoliday: false }],
  '10-17': [{ title: 'روز بین‌المللی ریشه‌کنی فقر', type: 'international', isHoliday: false }],
  '10-24': [
    { title: 'روز بین‌المللی اطلاعات و رسانه برای همه', type: 'international', isHoliday: false },
    { title: 'روز سازمان ملل', type: 'international', isHoliday: false }
  ],
  '10-27': [{ title: 'روز میراث صوتی-تصویری بین‌المللی', type: 'international', isHoliday: false }],
  '10-29': [{ title: 'روز بین‌المللی مراقبت و حمایت', type: 'international', isHoliday: false }],
  '10-31': [{ title: 'روز جهانی شهرها', type: 'international', isHoliday: false }],

  // نوامبر
  '11-02': [
    { title: 'روز بین‌المللی پایان مصونیت برای جرائم علیه روزنامه‌نگاران', type: 'international', isHoliday: false },
    { title: 'روز بین‌المللی مبارزه با خشونت و زورگویی در مدرسه (شامل سایبری)', type: 'international', isHoliday: false }
  ],
  '11-03': [{ title: 'روز جهانی ذخایر زیست‌کره (Biosphere Reserves Day)', type: 'international', isHoliday: false }],
  '11-05': [
    { title: 'روز جهانی سونامی (World Tsunami Awareness Day)', type: 'international', isHoliday: false },
    { title: 'روز جهانی روز زبان رومانیایی (World Day of Romani Language)', type: 'international', isHoliday: false }
  ],
  '11-06': [{ title: 'روز بین‌المللی حفاظت از محیط زیست در جنگ و درگیری', type: 'international', isHoliday: false }],
  '11-10': [{ title: 'روز جهانی علم برای صلح و توسعه (World Science Day)', type: 'international', isHoliday: false }],
  '11-13': [{ title: 'هفته جهانی مقاومت میکروبی (AMR Awareness Week)', type: 'international', isHoliday: false }],
  '11-14': [
    { title: 'روز جهانی دیابت', type: 'international', isHoliday: false },
    { title: 'روز بین‌المللی مبارزه با قاچاق آثار فرهنگی', type: 'international', isHoliday: false }
  ],
  '11-15': [{ title: 'روز بین‌المللی مبارزه با جرایم سازمان‌یافته فراملی', type: 'international', isHoliday: false }],
  '11-16': [
    { title: 'روز بین‌المللی مدارا (Tolerance Day)', type: 'international', isHoliday: false },
    { title: 'روز جهانی یادبود قربانیان ترافیک جاده‌ای', type: 'international', isHoliday: false }
  ],
  '11-18': [{ title: 'روز پیشگیری و درمان سوء استفاده از کودکان (Child Sexual Exploitation Day)', type: 'international', isHoliday: false }],
  '11-19': [{ title: 'روز جهانی توالت (World Toilet Day)', type: 'international', isHoliday: false }],
  '11-20': [
    { title: 'روز جهانی کودکان', type: 'international', isHoliday: false },
    { title: 'روز فلسفه جهانی (World Philosophy Day)', type: 'international', isHoliday: false }
  ],
  '11-21': [{ title: 'روز جهانی تلویزیون', type: 'international', isHoliday: false }],
  '11-25': [{ title: 'روز بین‌المللی حذف خشونت علیه زنان', type: 'international', isHoliday: false }],
  '11-26': [
    { title: 'روز جهانی حمل‌ونقل پایدار', type: 'international', isHoliday: false },
    { title: 'روز جهانی زیتون', type: 'international', isHoliday: false }
  ],
  '11-29': [{ title: 'روز بین‌المللی همبستگی با مردم فلسطین', type: 'international', isHoliday: false }],
  '11-30': [{ title: 'روز یادبود همه قربانیان جنگ شیمیایی', type: 'international', isHoliday: false }],

  // دسامبر
  '12-01': [{ title: 'روز جهانی ایدز', type: 'international', isHoliday: false }],
  '12-02': [{ title: 'روز بین‌المللی لغو برده‌داری', type: 'international', isHoliday: false }],
  '12-03': [{ title: 'روز بین‌المللی معلولان', type: 'international', isHoliday: false }],
  '12-04': [{ title: 'روز بین‌المللی بانک‌ها', type: 'international', isHoliday: false }],
  '12-05': [
    { title: 'روز داوطلبان برای توسعه اقتصادی و اجتماعی', type: 'international', isHoliday: false },
    { title: 'روز جهانی خاک (World Soil Day)', type: 'international', isHoliday: false }
  ],
  '12-07': [{ title: 'روز بین‌المللی هوانوردی غیرنظامی', type: 'international', isHoliday: false }],
  '12-09': [
    { title: 'روز بین‌المللی گرامی‌داشت قربانیان نسل‌کشی', type: 'international', isHoliday: false },
    { title: 'روز بین‌المللی ضد فساد', type: 'international', isHoliday: false }
  ],
  '12-10': [{ title: 'روز جهانی حقوق بشر', type: 'international', isHoliday: false }],
  '12-11': [{ title: 'روز جهانی کوه‌ها', type: 'international', isHoliday: false }],
  '12-12': [{ title: 'روز بین‌المللی بی‌طرفی', type: 'international', isHoliday: false },
            { title: 'روز پوشش بهداشتی همگانی (Universal Health Coverage Day)', type: 'international', isHoliday: false }],
  '12-18': [
    { title: 'روز بین‌المللی مهاجران', type: 'international', isHoliday: false },
    { title: 'روز همبستگی انسانی (Human Solidarity Day)', type: 'international', isHoliday: false }
  ],
  '12-20': [{ title: 'روز جهانی بسکتبال (World Basketball Day)', type: 'international', isHoliday: false }],
  '12-21': [{ title: 'روز بین‌المللی آمادگی اپیدمی‌ها', type: 'international', isHoliday: false }],
  '12-27': [{ title: 'روز بین‌المللی آمادگی در برابر بیماری همه‌گیر', type: 'international', isHoliday: false }],
}

// مناسبت‌های تقویم جلالی (شمسی) - ماه/روز
// فقط مناسبت‌های ملی، فرهنگی، تاریخی و باستانی
export const jalaliOccasions: Record<string, Occasion[]> = {
  // فروردین
  '01-01': [{ title: 'جشن نوروز / سال نو', type: 'national', isHoliday: true }],
  '01-02': [{ title: 'عید نوروز', type: 'national', isHoliday: true }],
  '01-03': [{ title: 'عید نوروز', type: 'national', isHoliday: true }],
  '01-04': [{ title: 'عید نوروز', type: 'national', isHoliday: true }],
  '01-06': [{ title: 'روز امید و شادباش', type: 'national', isHoliday: false }],
  '01-10': [{ title: 'جشن آبان‌گاه', type: 'national', isHoliday: false }],
  '01-12': [{ title: 'روز جمهوری اسلامی ایران', type: 'national', isHoliday: true }],
  '01-13': [{ title: 'روز طبیعت (سیزده بدر)', type: 'national', isHoliday: true }],
  '01-17': [{ title: 'روز اختراعات و اکتشافات', type: 'national', isHoliday: false }],
  '01-19': [{ title: 'روز ارتش', type: 'national', isHoliday: false }],
  '01-21': [{ title: 'روز بزرگداشت سعدی', type: 'national', isHoliday: false }],
  '01-25': [{ title: 'روز بزرگداشت عطار نیشابوری', type: 'national', isHoliday: false }],

  // اردیبهشت
  '02-02': [{ title: 'روز بزرگداشت سیف فرغانی', type: 'national', isHoliday: false }],
  '02-03': [{ title: 'روز معلم / شهادت مرتضی مطهری', type: 'national', isHoliday: false }],
  '02-04': [{ title: 'روز ملی کارآفرینی', type: 'national', isHoliday: false }],
  '02-10': [{ title: 'روز ملی خلیج فارس', type: 'national', isHoliday: false }],
  '02-12': [{ title: 'روز پرستار', type: 'national', isHoliday: false }],
  '02-15': [{ title: 'روز بزرگداشت شیخ بهایی', type: 'national', isHoliday: false }],
  '02-25': [{ title: 'روز بزرگداشت فردوسی', type: 'national', isHoliday: false }],

  // خرداد
  '03-01': [{ title: 'روز بهره‌وری و بهینه‌سازی مصرف', type: 'national', isHoliday: false }],
  '03-03': [{ title: 'فتح خرمشهر', type: 'national', isHoliday: false }],
  '03-04': [{ title: 'روز دزفول', type: 'national', isHoliday: false }],
  '03-13': [{ title: 'روز ملی گل و گیاه', type: 'national', isHoliday: false }],
  '03-15': [{ title: 'قیام ۱۵ خرداد ۱۳۴۲', type: 'national', isHoliday: true }],
  '03-18': [{ title: 'روز جهانی قدس', type: 'national', isHoliday: false }],

  // تیر
  '04-01': [{ title: 'جشن تیرگان', type: 'national', isHoliday: false }],
  '04-07': [{ title: 'روز قوه قضاییه', type: 'national', isHoliday: false }],
  '04-13': [{ title: 'روز صنعت و معدن', type: 'national', isHoliday: false }],
  '04-14': [{ title: 'روز قلم', type: 'national', isHoliday: false }],

  // مرداد
  '05-01': [{ title: 'روز بزرگداشت ابوریحان بیرونی', type: 'national', isHoliday: false }],
  '05-06': [{ title: 'جشن چله‌ی تابستان', type: 'national', isHoliday: false }],
  '05-09': [{ title: 'روز اهدای عضو و پیوند اعضا', type: 'national', isHoliday: false }],
  '05-13': [{ title: 'روز صنایع دستی', type: 'national', isHoliday: false }],
  '05-17': [{ title: 'روز خبرنگار', type: 'national', isHoliday: false }],

  // شهریور
  '06-01': [{ title: 'روز بزرگداشت ملاصدرا', type: 'national', isHoliday: false }],
  '06-04': [{ title: 'روز کارمند', type: 'national', isHoliday: false }],
  '06-06': [{ title: 'جشن خرم‌روز / خرمگان', type: 'national', isHoliday: false }],
  '06-08': [{ title: 'روز مبارزه با تروریسم', type: 'national', isHoliday: false }],
  '06-17': [{ title: 'روز شعر و ادب پارسی', type: 'national', isHoliday: false }],
  '06-27': [{ title: 'آغاز جنگ تحمیلی', type: 'national', isHoliday: false }],

  // مهر
  '07-01': [{ title: 'روز آتش‌نشانی و ایمنی', type: 'national', isHoliday: false }],
  '07-02': [{ title: 'روز بزرگداشت حافظ', type: 'national', isHoliday: false }],
  '07-05': [{ title: 'روز آیین‌دادرسی و احترام به وکلا', type: 'national', isHoliday: false }],
  '07-06': [{ title: 'جشن مهرگان', type: 'national', isHoliday: false }],
  '07-08': [{ title: 'روز دفاع مقدس', type: 'national', isHoliday: false }],
  '07-10': [{ title: 'روز ملی شهرهای بدون خودرو', type: 'national', isHoliday: false }],
  '07-13': [{ title: 'روز دانش‌آموز', type: 'national', isHoliday: false }],
  '07-20': [{ title: 'روز بانکداری اسلامی', type: 'national', isHoliday: false }],
  '07-24': [{ title: 'روز ملی کنترل دیابت', type: 'national', isHoliday: false }],
  '07-25': [{ title: 'روز بزرگداشت پروین اعتصامی', type: 'national', isHoliday: false }],
  '07-26': [{ title: 'روز بزرگداشت ابن‌سینا / روز پزشک', type: 'national', isHoliday: false }],
  '07-29': [{ title: 'روز ملی احسان و نیکوکاری', type: 'national', isHoliday: false }],

  // آبان
  '08-01': [{ title: 'روز آمار و برنامه‌ریزی', type: 'national', isHoliday: false }],
  '08-02': [{ title: 'روز بزرگداشت شیخ مفید', type: 'national', isHoliday: false }],
  '08-09': [{ title: 'روز اورژانس', type: 'national', isHoliday: false }],
  '08-13': [{ title: 'روز دانشجو', type: 'national', isHoliday: false }],
  '08-16': [{ title: 'روز دامپزشکی', type: 'national', isHoliday: false }],
  '08-19': [{ title: 'روز بزرگداشت رودکی', type: 'national', isHoliday: false }],
  '08-24': [{ title: 'روز کتاب، کتابخوانی و کتابدار', type: 'national', isHoliday: false }],

  // آذر
  '09-01': [{ title: 'روز بسیج', type: 'national', isHoliday: false }],
  '09-05': [{ title: 'جشن آذرگان', type: 'national', isHoliday: false }],
  '09-07': [{ title: 'روز نیروی دریایی', type: 'national', isHoliday: false }],
  '09-09': [{ title: 'روز جهانی پاکبان', type: 'national', isHoliday: false }],
  '09-16': [{ title: 'روز دانشجو', type: 'national', isHoliday: false }],
  '09-25': [{ title: 'روز پژوهش', type: 'national', isHoliday: false }],
  '09-26': [{ title: 'روز حمل و نقل', type: 'national', isHoliday: false }],

  // دی
  '10-01': [{ title: 'میلاد خورشید / جشن خرم‌روز', type: 'national', isHoliday: false }],
  '10-02': [{ title: 'روز ملی امید', type: 'national', isHoliday: false }],
  '10-05': [{ title: 'جشن دی‌گان', type: 'national', isHoliday: false }],
  '10-08': [{ title: 'روز دختران', type: 'national', isHoliday: false }],
  '10-11': [{ title: 'شب یلدا / شب چله', type: 'national', isHoliday: false }],
  '10-14': [{ title: 'روز مهندس', type: 'national', isHoliday: false }],
  '10-24': [{ title: 'روز میلاد زرتشت', type: 'national', isHoliday: false }],

  // بهمن
  '11-06': [{ title: 'روز فناوری فضایی', type: 'national', isHoliday: false }],
  '11-10': [{ title: 'روز حماسه حسینیه ارشاد', type: 'national', isHoliday: false }],
  '11-12': [{ title: 'پیروزی انقلاب اسلامی', type: 'national', isHoliday: true }],
  '11-19': [{ title: 'روز ارتش', type: 'national', isHoliday: false }],
  '11-22': [{ title: 'روز ملی شدن صنعت نفت', type: 'national', isHoliday: true }],
  '11-27': [{ title: 'روز درختکاری', type: 'national', isHoliday: false }],
  '11-30': [{ title: 'جشن سپندارمذگان / روز عشق', type: 'national', isHoliday: false }],

  // اسفند
  '12-01': [{ title: 'روز ملی حمل و نقل عمومی', type: 'national', isHoliday: false }],
  '12-05': [{ title: 'جشن اسفندگان', type: 'national', isHoliday: false }],
  '12-08': [{ title: 'روز مهندس کنترل', type: 'national', isHoliday: false }],
  '12-12': [{ title: 'روز بزرگداشت خواجه نصیرالدین طوسی', type: 'national', isHoliday: false }],
  '12-15': [{ title: 'جشن سده / آتش‌افروزی', type: 'national', isHoliday: false }],
  '12-17': [{ title: 'روز بزرگداشت شهریار', type: 'national', isHoliday: false }],
  '12-18': [{ title: 'روز صادرات', type: 'national', isHoliday: false }],
  '12-20': [{ title: 'روز بزرگداشت شمس تبریزی', type: 'national', isHoliday: false }],
  '12-25': [{ title: 'روز بزرگداشت ناصرخسرو', type: 'national', isHoliday: false }],
  '12-26': [{ title: 'جشن فروردینگان', type: 'national', isHoliday: false }],
  '12-29': [{ title: 'روز ملی شدن صنایع', type: 'national', isHoliday: false }],
}


// مناسبت‌های تقویم قمری (هجری) - ماه/روز (گسترده و کامل)
export const islamicOccasions: Record<string, Occasion[]> = {
  // محرم
  '01-01': [{ title: 'سال نو هجری', type: 'religious', isHoliday: false }],
  '01-02': [{ title: 'شهادت حضرت علی اصغر (ع)', type: 'religious', isHoliday: false }],
  '01-07': [{ title: 'عاشورای حسینی / شهادت امام حسین', type: 'religious', isHoliday: true }],
  '01-09': [{ title: 'تاسوعای حسینی', type: 'religious', isHoliday: true }],
  '01-10': [{ title: 'عاشورای حسینی / شهادت امام حسین', type: 'religious', isHoliday: true }],
  '01-12': [{ title: 'شهادت امام سجاد', type: 'religious', isHoliday: false }],
  '01-13': [{ title: 'رحلت حضرت مسلم بن عقیل', type: 'religious', isHoliday: false }],

  // صفر
  '02-07': [{ title: 'شهادت امام حسن مجتبی', type: 'religious', isHoliday: false }],
  '02-10': [{ title: 'شهادت حضرت رقیه', type: 'religious', isHoliday: false }],
  '02-20': [{ title: 'اربعین حسینی', type: 'religious', isHoliday: true }],
  '02-28': [{ title: 'رحلت پیامبر اکرم (ص) و شهادت امام حسن مجتبی', type: 'religious', isHoliday: true }],
  '02-29': [{ title: 'شهادت امام رضا', type: 'religious', isHoliday: true }],

  // ربیع الاول
  '03-08': [{ title: 'شهادت امام حسن عسکری', type: 'religious', isHoliday: true }],
  '03-12': [{ title: 'میلاد پیامبر اکرم (اهل سنت)', type: 'religious', isHoliday: false }],
  '03-17': [{ title: 'میلاد پیامبر اکرم و امام جعفر صادق', type: 'religious', isHoliday: true }],

  // ربیع الثانی
  '04-08': [{ title: 'میلاد امام حسن عسکری', type: 'religious', isHoliday: false }],
  '04-10': [{ title: 'وفات حضرت معصومه', type: 'religious', isHoliday: false }],

  // جمادی الاول
  '05-05': [{ title: 'ولادت حضرت زینب', type: 'religious', isHoliday: false }],
  '05-13': [{ title: 'شهادت حضرت فاطمه (روایت اول)', type: 'religious', isHoliday: false }],
  '05-15': [{ title: 'ولادت امام محمد باقر', type: 'religious', isHoliday: false }],

  // جمادی الثانی
  '06-03': [{ title: 'شهادت حضرت فاطمه (روایت دوم)', type: 'religious', isHoliday: true }],
  '06-10': [{ title: 'ولادت حضرت معصومه', type: 'religious', isHoliday: false }],
  '06-20': [{ title: 'ولادت حضرت فاطمه', type: 'religious', isHoliday: false }],

  // رجب
  '07-01': [{ title: 'ولادت امام محمد باقر', type: 'religious', isHoliday: false }],
  '07-03': [{ title: 'شهادت امام علی نقی (هادی)', type: 'religious', isHoliday: false }],
  '07-07': [{ title: 'ولادت حضرت علی اکبر', type: 'religious', isHoliday: false }],
  '07-10': [{ title: 'ولادت امام محمد تقی (جواد)', type: 'religious', isHoliday: false }],
  '07-13': [{ title: 'ولادت امام علی', type: 'religious', isHoliday: true }],
  '07-15': [{ title: 'وفات حضرت زینب', type: 'religious', isHoliday: false }],
  '07-25': [{ title: 'شهادت امام موسی کاظم', type: 'religious', isHoliday: false }],
  '07-27': [{ title: 'مبعث پیامبر اکرم', type: 'religious', isHoliday: true }],

  // شعبان
  '08-03': [{ title: 'ولادت امام حسین', type: 'religious', isHoliday: false }],
  '08-04': [{ title: 'ولادت ابوالفضل عباس', type: 'religious', isHoliday: false }],
  '08-05': [{ title: 'ولادت امام سجاد', type: 'religious', isHoliday: false }],
  '08-11': [{ title: 'ولادت علی اکبر', type: 'religious', isHoliday: false }],
  '08-15': [{ title: 'ولادت امام مهدی (عج)', type: 'religious', isHoliday: true }],

  // رمضان
  '09-01': [{ title: 'اولین روز ماه رمضان', type: 'religious', isHoliday: false }],
  '09-15': [{ title: 'ولادت امام حسن مجتبی', type: 'religious', isHoliday: false }],
  '09-17': [{ title: 'ولادت امام علی', type: 'religious', isHoliday: false }],
  '09-19': [{ title: 'ضربت خوردن حضرت علی', type: 'religious', isHoliday: false }],
  '09-21': [{ title: 'شهادت امام علی', type: 'religious', isHoliday: true }],
  '09-22': [{ title: 'شب قدر', type: 'religious', isHoliday: false }],
  '09-23': [{ title: 'شب قدر', type: 'religious', isHoliday: false }],
  '09-27': [{ title: 'شب قدر', type: 'religious', isHoliday: false }],

  // شوال
  '10-01': [{ title: 'عید سعید فطر', type: 'religious', isHoliday: true }],
  '10-02': [{ title: 'تعطیل عید فطر', type: 'religious', isHoliday: true }],
  '10-25': [{ title: 'شهادت امام جعفر صادق', type: 'religious', isHoliday: true }],

  // ذی القعده
  '11-01': [{ title: 'ولادت حضرت معصومه', type: 'religious', isHoliday: false }],
  '11-11': [{ title: 'ولادت امام رضا', type: 'religious', isHoliday: false }],
  '11-23': [{ title: 'ولادت امام علی نقی (هادی)', type: 'religious', isHoliday: false }],
  '11-29': [{ title: 'شهادت امام محمد تقی (جواد)', type: 'religious', isHoliday: false }],

  // ذی الحجه
  '12-01': [{ title: 'ولادت امام سجاد', type: 'religious', isHoliday: false }],
  '12-07': [{ title: 'شهادت امام محمد باقر', type: 'religious', isHoliday: false }],
  '12-09': [{ title: 'روز عرفه', type: 'religious', isHoliday: false }],
  '12-10': [{ title: 'عید سعید قربان', type: 'religious', isHoliday: true }],
  '12-15': [{ title: 'ولادت امام علی نقی', type: 'religious', isHoliday: false }],
  '12-18': [{ title: 'عید سعید غدیر خم', type: 'religious', isHoliday: true }],
  '12-24': [{ title: 'عید مباهله', type: 'religious', isHoliday: false }],
};

// تابع دریافت مناسبت‌های یک تاریخ
export function getOccasions(
  calendar: 'gregorian' | 'jalali' | 'islamic',
  month: number,
  day: number
): Occasion[] {
  const key = `${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`

  if (calendar === 'gregorian') {
    return gregorianOccasions[key] || []
  } else if (calendar === 'jalali') {
    return jalaliOccasions[key] || []
  } else {
    return islamicOccasions[key] || []
  }
}

// تابع بررسی تعطیل بودن یک روز
export function isHoliday(
  calendar: 'gregorian' | 'jalali' | 'islamic',
  month: number,
  day: number,
  dayOfWeek: number // 0=یکشنبه تا 6=شنبه
): boolean {
  // بررسی تعطیلی هفتگی
  if (calendar === 'gregorian' && dayOfWeek === 0) { // یکشنبه
    return true
  }
  if ((calendar === 'jalali' || calendar === 'islamic') && dayOfWeek === 5) { // جمعه
    return true
  }

  // بررسی تعطیلات رسمی
  const occasions = getOccasions(calendar, month, day)
  return occasions.some(occ => occ.isHoliday)
}

// تابع بررسی تعطیل بودن با در نظر گرفتن تاریخ قمری برای جلالی
export function isHolidayWithIslamic(
  jalaliMonth: number,
  jalaliDay: number,
  islamicMonth: number,
  islamicDay: number,
  dayOfWeek: number
): boolean {
  // جمعه‌ها تعطیل است
  if (dayOfWeek === 5) {
    return true
  }

  // تعطیلات ملی جلالی
  const jalaliOccasions = getOccasions('jalali', jalaliMonth, jalaliDay)
  if (jalaliOccasions.some(occ => occ.isHoliday)) {
    return true
  }

  // تعطیلات مذهبی قمری
  const islamicOccasions = getOccasions('islamic', islamicMonth, islamicDay)
  if (islamicOccasions.some(occ => occ.isHoliday)) {
    return true
  }

  return false
}

// تابع دریافت تمام مناسبت‌های یک تاریخ میلادی (از هر سه تقویم)
export function getAllOccasionsForDate(
  gregorianDate: Date,
  jalaliMonth: number,
  jalaliDay: number,
  islamicMonth: number,
  islamicDay: number
): { calendar: string; occasions: Occasion[] }[] {
  const result: { calendar: string; occasions: Occasion[] }[] = []

  // مناسبت‌های میلادی
  const gregOccasions = getOccasions('gregorian', gregorianDate.getMonth() + 1, gregorianDate.getDate())
  if (gregOccasions.length > 0) {
    result.push({ calendar: 'میلادی', occasions: gregOccasions })
  }

  // مناسبت‌های جلالی
  const jalOccasions = getOccasions('jalali', jalaliMonth + 1, jalaliDay)
  if (jalOccasions.length > 0) {
    result.push({ calendar: 'شمسی', occasions: jalOccasions })
  }

  // مناسبت‌های قمری
  const islOccasions = getOccasions('islamic', islamicMonth + 1, islamicDay)
  if (islOccasions.length > 0) {
    result.push({ calendar: 'قمری', occasions: islOccasions })
  }

  return result
}
