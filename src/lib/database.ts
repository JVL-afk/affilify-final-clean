import { ObjectId } from 'mongodb'
import { connectToDatabase } from './mongodb'
import { GeneratedWebsite } from './ai'

export interface Website {
  _id: ObjectId
  id: string
  userId: string
  title: string
  description: string
  content: any
  seo: any
  affiliateLinks: any
  template: string
  url?: string
  status: 'draft' | 'published' | 'archived'
  views: number
  clicks: number
  conversions: number
  revenue: number
  createdAt: Date
  updatedAt: Date
}

export interface Analysis {
  _id: ObjectId
  id: string
  userId: string
  url: string
  analysisType: string
  score: number
  metrics: any
  competitors: any[]
  suggestions: string[]
  createdAt: Date
}

export async function saveWebsite(userId: string, websiteData: GeneratedWebsite): Promise<Website | null> {
  try {
    const { db } = await connectToDatabase()
    
    const website = {
      id: websiteData.id,
      userId,
      title: websiteData.title,
      description: websiteData.description,
      content: websiteData.content,
      seo: websiteData.seo,
      affiliateLinks: websiteData.affiliateLinks,
      template: websiteData.template,
      status: 'draft' as const,
      views: 0,
      clicks: 0,
      conversions: 0,
      revenue: 0,
      createdAt: websiteData.createdAt,
      updatedAt: new Date()
    }
    
    const result = await db.collection('websites').insertOne(website)
    
    if (!result.insertedId) {
      return null
    }
    
    return {
      ...website,
      _id: result.insertedId
    }
  } catch (error) {
    console.error('Error saving website:', error)
    return null
  }
}

export async function getUserWebsites(userId: string, limit?: number): Promise<Website[]> {
  try {
    const { db } = await connectToDatabase()
    
    const query = { userId }
    const options = {
      sort: { createdAt: -1 },
      ...(limit && { limit })
    }
    
    const websites = await db.collection('websites').find(query, options).toArray()
    
    return websites.map(website => ({
      ...website,
      id: website._id.toString()
    })) as Website[]
  } catch (error) {
    console.error('Error getting user websites:', error)
    return []
  }
}

export async function getWebsiteById(websiteId: string, userId?: string): Promise<Website | null> {
  try {
    const { db } = await connectToDatabase()
    
    const query: any = { _id: new ObjectId(websiteId) }
    if (userId) {
      query.userId = userId
    }
    
    const website = await db.collection('websites').findOne(query)
    
    if (!website) {
      return null
    }
    
    return {
      ...website,
      id: website._id.toString()
    } as Website
  } catch (error) {
    console.error('Error getting website by ID:', error)
    return null
  }
}

export async function updateWebsite(websiteId: string, userId: string, updates: Partial<Website>): Promise<boolean> {
  try {
    const { db } = await connectToDatabase()
    
    const result = await db.collection('websites').updateOne(
      { _id: new ObjectId(websiteId), userId },
      { 
        $set: { 
          ...updates, 
          updatedAt: new Date() 
        } 
      }
    )
    
    return result.modifiedCount > 0
  } catch (error) {
    console.error('Error updating website:', error)
    return false
  }
}

export async function deleteWebsite(websiteId: string, userId: string): Promise<boolean> {
  try {
    const { db } = await connectToDatabase()
    
    const result = await db.collection('websites').deleteOne({
      _id: new ObjectId(websiteId),
      userId
    })
    
    return result.deletedCount > 0
  } catch (error) {
    console.error('Error deleting website:', error)
    return false
  }
}

export async function publishWebsite(websiteId: string, userId: string): Promise<string | null> {
  try {
    const { db } = await connectToDatabase()
    
    // Generate a unique URL for the website
    const website = await getWebsiteById(websiteId, userId)
    if (!website) {
      return null
    }
    
    const slug = website.title.toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')
    
    const url = `https://affilify.eu/sites/${slug}-${websiteId.slice(-8)}`
    
    const result = await db.collection('websites').updateOne(
      { _id: new ObjectId(websiteId), userId },
      { 
        $set: { 
          status: 'published',
          url,
          updatedAt: new Date() 
        } 
      }
    )
    
    return result.modifiedCount > 0 ? url : null
  } catch (error) {
    console.error('Error publishing website:', error)
    return null
  }
}

export async function saveAnalysis(userId: string, analysisData: any): Promise<Analysis | null> {
  try {
    const { db } = await connectToDatabase()
    
    const analysis = {
      id: analysisData.id || new ObjectId().toString(),
      userId,
      url: analysisData.url,
      analysisType: analysisData.analysisType,
      score: analysisData.score,
      metrics: analysisData.metrics,
      competitors: analysisData.competitors,
      suggestions: analysisData.suggestions,
      createdAt: analysisData.createdAt || new Date()
    }
    
    const result = await db.collection('analyses').insertOne(analysis)
    
    if (!result.insertedId) {
      return null
    }
    
    return {
      ...analysis,
      _id: result.insertedId
    }
  } catch (error) {
    console.error('Error saving analysis:', error)
    return null
  }
}

export async function getUserAnalyses(userId: string, limit?: number): Promise<Analysis[]> {
  try {
    const { db } = await connectToDatabase()
    
    const query = { userId }
    const options = {
      sort: { createdAt: -1 },
      ...(limit && { limit })
    }
    
    const analyses = await db.collection('analyses').find(query, options).toArray()
    
    return analyses.map(analysis => ({
      ...analysis,
      id: analysis._id.toString()
    })) as Analysis[]
  } catch (error) {
    console.error('Error getting user analyses:', error)
    return []
  }
}

export async function getAnalysisById(analysisId: string, userId?: string): Promise<Analysis | null> {
  try {
    const { db } = await connectToDatabase()
    
    const query: any = { _id: new ObjectId(analysisId) }
    if (userId) {
      query.userId = userId
    }
    
    const analysis = await db.collection('analyses').findOne(query)
    
    if (!analysis) {
      return null
    }
    
    return {
      ...analysis,
      id: analysis._id.toString()
    } as Analysis
  } catch (error) {
    console.error('Error getting analysis by ID:', error)
    return null
  }
}

export async function getDashboardStats(userId: string): Promise<any> {
  try {
    const { db } = await connectToDatabase()
    
    const [websites, analyses] = await Promise.all([
      db.collection('websites').find({ userId }).toArray(),
      db.collection('analyses').find({ userId }).toArray()
    ])
    
    const totalViews = websites.reduce((sum, site) => sum + (site.views || 0), 0)
    const totalClicks = websites.reduce((sum, site) => sum + (site.clicks || 0), 0)
    const totalRevenue = websites.reduce((sum, site) => sum + (site.revenue || 0), 0)
    
    const recentWebsites = websites
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 5)
    
    const recentAnalyses = analyses
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 5)
    
    return {
      websites: {
        total: websites.length,
        published: websites.filter(w => w.status === 'published').length,
        draft: websites.filter(w => w.status === 'draft').length
      },
      analyses: {
        total: analyses.length,
        averageScore: analyses.length > 0 
          ? Math.round(analyses.reduce((sum, a) => sum + a.score, 0) / analyses.length)
          : 0
      },
      performance: {
        totalViews,
        totalClicks,
        totalRevenue,
        conversionRate: totalClicks > 0 ? ((totalClicks / totalViews) * 100).toFixed(2) : '0.00'
      },
      recent: {
        websites: recentWebsites,
        analyses: recentAnalyses
      }
    }
  } catch (error) {
    console.error('Error getting dashboard stats:', error)
    return {
      websites: { total: 0, published: 0, draft: 0 },
      analyses: { total: 0, averageScore: 0 },
      performance: { totalViews: 0, totalClicks: 0, totalRevenue: 0, conversionRate: '0.00' },
      recent: { websites: [], analyses: [] }
    }
  }
}

