// Este arquivo é um Server Component e não deve ter a diretiva 'use client'

// Simulação de dados que seriam retornados pelo seu backend
const mockData = {
    daily: {
        stats: [
            { title: 'Descarte', value: 7265, change: 0.1101 },
            { title: 'Ocorrências', value: 3671, change: -0.0003 },
            { title: 'Volume Coletado', value: 156, change: 0.1503 },
            { title: 'Impacto Ambiental', value: 2318, change: 0.0008 },
        ],
        lineChart: {
            labels: ['01h', '06h', '12h', '18h', '23h'],
            datasets: [
                { label: 'Descarte por hora', data: [1200, 1900, 1500, 2500, 2200] },
                { label: 'Média', data: [800, 1200, 1100, 1800, 1600], borderDash: [5, 5] },
            ],
        },
    },
    monthly: {
        stats: [
            { title: 'Descarte', value: 98450, change: 0.0822 },
            { title: 'Ocorrências', value: 12500, change: -0.0510 },
            { title: 'Volume Coletado', value: 2500, change: 0.0450 },
            { title: 'Impacto Ambiental', value: 32000, change: 0.0150 },
        ],
        lineChart: {
            labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'],
            datasets: [
                { label: 'Descarte Mensal', data: [12000, 19000, 15000, 25000, 22000, 30000, 28000] },
                { label: 'Ano Anterior', data: [8000, 12000, 11000, 18000, 16000, 20000, 24000], borderDash: [5, 5] },
            ],
        },
    },
    yearly: {
        stats: [
            { title: 'Descarte', value: 1200000, change: 0.2000 },
            { title: 'Ocorrências', value: 150000, change: -0.0150 },
            { title: 'Volume Coletado', value: 30000, change: 0.0700 },
            { title: 'Impacto Ambiental', value: 500000, change: 0.0500 },
        ],
        lineChart: {
            labels: ['2021', '2022', '2023', '2024'],
            datasets: [
                { label: 'Descarte Anual', data: [500000, 800000, 1000000, 1200000] },
                { label: 'Projeção', data: [550000, 750000, 950000, 1300000], borderDash: [5, 5] },
            ],
        },
    }
};

const commonData = {
    // Estes dados seriam tipicamente estáticos ou calculados a partir de dados brutos
    doughnutChart: [
        { label: 'Ibura', data: 52.1, color: 'rgb(30, 58, 138)' },
        { label: 'Ilha do Leite', data: 22.8, color: 'rgb(59, 130, 246)' },
        { label: 'Recife Antigo', data: 13.9, color: 'rgb(96, 165, 250)' },
        { label: 'Outros', data: 11.2, color: 'rgb(147, 197, 253)' },
    ],
    recentAlerts: [
        { name: 'Critico - Ibura', status: 'active' },
        { name: 'Medio - Ilha do Leite', status: 'active' },
        { name: 'Critico - Recife Antigo', status: 'active' },
        { name: 'Baixo - Boa Viagem', status: 'inactive' },
        { name: 'Critico - Imbiribeira', status: 'active' },
        { name: 'Medio - Pina', status: 'inactive' },
    ],
}

// Handler para a requisição GET
export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const period = searchParams.get('period') as keyof typeof mockData;

    // Simula a latência da rede
    await new Promise(resolve => setTimeout(resolve, 800));

    // Retorna os dados com base no filtro
    if (period && mockData[period]) {
        return Response.json({
            ...mockData[period],
            ...commonData
        });
    }

    // Fallback
    return new Response(
        JSON.stringify({ message: "Período não encontrado" }),
        { status: 404 }
    );
}