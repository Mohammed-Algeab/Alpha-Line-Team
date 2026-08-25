# مرجع Cloudflare R2 — قرار Alpha Line المؤجل

**التاريخ:** 2026-08-22  
**الحالة:** مرجع تقني؛ لا يتطلب إجراءً من المستخدم حاليًا.

توضح وثائق Cloudflare أن R2 bucket خاص افتراضيًا، ولا يصبح متاحًا للعامة إلا بعد تفعيل صريح. كما أن رابط `r2.dev` العام مخصص للتطوير وغير مناسب للإنتاج لأنه مقيّد المعدل؛ أما الاستخدام العام الإنتاجي فيتطلب نطاقًا مخصصًا يُضاف إلى الحساب نفسه.

لهذا يؤجّل Alpha Line استخدام R2 إلى مرحلة يتوفر فيها مصدر دفع ودومين عام. في مرحلة المعاينة لا توجد حاجة إلى R2 أو مفاتيح API أو بيانات وصول. ستبقى روابط الصور معزولة في إعداد مركزي كي تُنقل لاحقًا إلى `assets.<domain>` من دون تغيير بيانات المشاريع أو القوالب.

تذكر Cloudflare حصة شهرية مجانية لطبقة Standard قدرها 10 GB-month للتخزين، ومليون عملية Class A، و10 ملايين عملية Class B؛ ولا تنطبق هذه الحصة على طبقة Infrequent Access. ظهور طلب مصدر دفع في حساب المالك يحسم قرار التأجيل عمليًا، بصرف النظر عن هذه الحصة المنشورة.

## المراجع

1. [Create new buckets — Cloudflare R2](https://developers.cloudflare.com/r2/buckets/create-buckets/)
2. [Public buckets — Cloudflare R2](https://developers.cloudflare.com/r2/buckets/public-buckets/)
3. [Limits — Cloudflare R2](https://developers.cloudflare.com/r2/platform/limits/)
4. [Pricing — Cloudflare R2](https://developers.cloudflare.com/r2/pricing/)
