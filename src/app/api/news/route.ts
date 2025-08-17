import { NextRequest, NextResponse } from 'next/server';

interface StrapiData {
  data: {
    title: string;
    content: Array<{
      type: string;
      children: Array<{
        type: string;
        text: string;
      }>;
    }>;
    publishedat: string;
    publishedAt: string;
    cover?: number;
  };
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    
    // 從 formData 中提取資料
    const dataStr = formData.get('data') as string;
    const data = JSON.parse(dataStr);
    
    // 準備要發送到 Strapi 的資料
    const strapiData: StrapiData = {
      data: {
        title: data.title,
        content: [
          {
            type: "paragraph",
            children: [
              {
                type: "text",
                text: data.content
              }
            ]
          }
        ],
        publishedat: data.publishedat,
        publishedAt: data.publishedat // 同時設定兩個欄位以確保相容性
      }
    };

    // 如果有封面圖片，先上傳到 Strapi
    let coverId: number | null = null;
    const coverFile = formData.get('files.cover') as File;
    
    if (coverFile) {
      const uploadFormData = new FormData();
      uploadFormData.append('files', coverFile);
      
      const uploadResponse = await fetch(`${process.env.STRAPI_URL}/api/upload`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.STRAPI_TOKEN}`,
        },
        body: uploadFormData,
      });
      
      if (uploadResponse.ok) {
        const uploadResult = await uploadResponse.json();
        coverId = uploadResult[0]?.id;
      }
    }

    // 如果有封面圖片，加入到資料中
    if (coverId) {
      strapiData.data.cover = coverId;
    }

    // 發送資料到 Strapi
    const response = await fetch(`${process.env.STRAPI_URL}/api/news-items`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.STRAPI_TOKEN}`,
      },
      body: JSON.stringify(strapiData),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Strapi API 錯誤:', response.status, errorText);
      return NextResponse.json(
        { error: '新增失敗', details: errorText },
        { status: response.status }
      );
    }

    const result = await response.json();
    
    return NextResponse.json({
      success: true,
      data: result.data,
      message: '新聞新增成功'
    });

  } catch (error) {
    console.error('新增 news item 時發生錯誤:', error);
    return NextResponse.json(
      { error: '伺服器錯誤', message: '新增失敗，請稍後再試' },
      { status: 500 }
    );
  }
}
