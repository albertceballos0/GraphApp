//
//  Dijkstra.cpp
//  GraphApplication
//
//  Created by Albert Ceballos on 13/2/24.
//
#include "Graph.h"
#include <math.h>
#include <stdlib.h>
#include <queue>
#include <limits>


// =============================================================================
// Dijkstra ====================================================================
// =============================================================================



void Dijkstra(CGraph& graph, CVertex* pStart)
{



    int indice_pActual;


    list<CVertex>::iterator it = graph.m_Vertices.begin();
    CVertex* pActual;
    for (it; it != graph.m_Vertices.end(); ++it)
    {
        it->m_DijkstraVisit = false;
        if (it->m_Point == pStart->m_Point)
            it->m_DijkstraDistance = 0;
        else
            it->m_DijkstraDistance = DBL_MAX;
    }

    pActual = pStart;
    for (int i = 0; i < graph.GetNVertices(); i++)
    {
        std::list<CEdge*>::iterator aux = pActual->m_Edges.begin();
        for (aux; aux != pActual->m_Edges.end(); ++aux)
        {
            if ((*aux)->m_pDestination->m_DijkstraDistance > (*aux)->m_Length + pActual->m_DijkstraDistance) {
                (*aux)->m_pDestination->m_DijkstraDistance = (*aux)->m_Length + pActual->m_DijkstraDistance;
                (*aux)->m_pDestination->m_pDijkstraPrevious = *aux;
            }
        }

        pActual->m_DijkstraVisit = true;
        double min = DBL_MAX;
        for (it = graph.m_Vertices.begin(); it != graph.m_Vertices.end(); ++it) {
            if (it->m_DijkstraVisit == false && it->m_DijkstraDistance < min) {
                min = it->m_DijkstraDistance;
                pActual = graph.GetVertex(it->m_Name.c_str());
            }
        }
    }

}

// =============================================================================
// DijkstraQueue ===============================================================
// =============================================================================

struct comparator {
    bool operator()(CVertex* a, CVertex* b) {
        return b->m_DijkstraDistance < a->m_DijkstraDistance;
    }//Posar la comparaci� adient }
};





void DijkstraQueue(CGraph& graph, CVertex* pStart)
{
    std::priority_queue<CVertex*, std::vector<CVertex*>, comparator> pq;

        for (auto it = graph.m_Vertices.begin(); it != graph.m_Vertices.end(); ++it)
        {
            it->m_DijkstraVisit = false;
            if (it->m_Name == pStart->m_Name)
                it->m_DijkstraDistance = 0;
            else
                it->m_DijkstraDistance = std::numeric_limits<double>::max();
            pq.push(&(*it));
        }

        while (!pq.empty())
        {
            CVertex* pActual = pq.top();
            pq.pop();

            std::list<CEdge*>::iterator aux = pActual->m_Edges.begin();
            for (; aux != pActual->m_Edges.end(); ++aux)
            {
                if ((*aux)->m_pDestination->m_DijkstraDistance > (*aux)->m_Length + pActual->m_DijkstraDistance) {
                    (*aux)->m_pDestination->m_DijkstraDistance = (*aux)->m_Length + pActual->m_DijkstraDistance;
                    (*aux)->m_pDestination->m_pDijkstraPrevious = *aux;
                }
            }
        }

}
