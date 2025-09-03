// import { BaseService } from "./base.service";

import { api } from "../BackendConfig/api";
import { BaseService } from "./base.service";


export interface CreateProcedureData {
  name: string;
  description?: string;
}

export interface Step {
  id: string;
  name: string;
  description?: string;
  price?: number;
  order: number;
  estimated_duration?: number;
  required: boolean;
  procedure: string; // id de la procédure
  created_at: string;
  updated_at: string;
}

export interface ProcedureStat {
  id: string;
  title: string;
  total_clients: number;
  description: string;
  change: number;
  in_progress: number;
  completed: number;
  failed: number;
  timeframe: string;
}

export interface ProceduresWithStatsResponse {
  success: boolean;
  data: ProcedureStat[];
}

export interface Procedure {
  id: string;
  name: string;
  description?: string;
  price?: number;
  estimated_duration?: number;
  category?: string;
  is_active: boolean;
  organization: string; // id de l'organisation
  steps: Step[];
  created_at: string;
  updated_at: string;
}


export interface UpdateProcedureData {
  id: string;
  name: string;
  description?: string;
}

export interface CreateStepData {
  name: string;
  description?: string;
  price?: number;
  procedureId: string;
  order?: number;
  required?: boolean;
  estimatedDuration?: number;
}

export interface UpdateStepData {
  id: string;
  name: string;
  description?: string;
  price?: number;
  order?: number;
  required?: boolean;
  estimatedDuration?: number;
}


export class ProcedureService extends BaseService {
  /**
   * =====================
   *   PROCEDURES
   * =====================
   */
  async  getAllProcedures(): Promise<Procedure[]> {
   return await api.get(`api/procedures/procedures/`).then(res => res.data);
  }

  async getProcedureWithStats() {
    return await api.get("api/procedures/procedures/with-stats/").then(res => res.data)
  }

  async getProcedureById(id: string): Promise<Procedure> {
    const res = await api.get(`api/procedures/procedures/${id}/`);
    return res.data;
  }

  async createProcedure(data: Partial<Procedure>): Promise<Procedure> {
    const res = await api.post(`api/procedures/procedures/`, data);
    return res.data;
  }

  async updateProcedure(id: string, data: Partial<Procedure>): Promise<Procedure> {
    const res = await api.put(`api/procedures/procedures/${id}/`, data);
    return res.data;
  }

  async deleteProcedure(id: string): Promise<{ success: boolean }> {
    await api.delete(`api/procedures/procedures/${id}/`);
    return { success: true };
  }

  /**
   * =====================
   *   STEPS
   * =====================
   */
  async getSteps(procedureId?: string): Promise<Step[]> {
    const url = procedureId
      ? `api/procedures/steps/?procedure=${procedureId}`
      : `api/procedures/steps/`;

    const res = await api.get(url, { withCredentials: true });
    return res.data;
  }

  async getStepById(id: string): Promise<Step> {
    const res = await api.get(`api/procedures/steps/${id}/`);
    return res.data;
  }

  async createStep(data: Partial<Step>): Promise<Step> {
    const res = await api.post(`api/procedures/steps/`, data);
    return res.data;
  }

  async updateStep(id: string, data: Partial<Step>): Promise<Step> {
    const res = await api.put(`api/procedures/steps/${id}/`, data);
    return res.data;
  }

  async deleteStep(id: string): Promise<{ success: boolean }> {
    await api.delete(`api/procedures/steps/${id}/`);
    return { success: true };
  }
}
