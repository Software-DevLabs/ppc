import React from 'react';
import MailBox from '@/components/workspace/MailBox';

export default function Mail() {
  return (
    <div>
      <div className="mb-8">
        <h1 className="font-body text-2xl font-light text-foreground">بريد العملاء</h1>
        <p className="font-body text-sm text-muted-foreground mt-1.5">راسل عملاءك المستهدفين — وردودهم تصل هنا فقط</p>
      </div>
      <MailBox />
    </div>
  );
}
