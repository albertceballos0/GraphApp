#include "Graph.h"
#include <set>
#include <algorithm>
#include <limits>

// =============================================================================
// SalesmanTrackBacktracking ===================================================
// =============================================================================

CVertex* vDesti;

CTrack camiOptim(NULL);
CTrack camiActual(NULL);

double costCamiActual;
double costCamiOptim;

list<CVertex*> visites;

void backtrackingRec(CVertex* pActual)
{

	if (pActual == vDesti) {
		
		
		bool visit = true;
		
		
		for (CVertex* v : visites) {
			visit = false;
			for (CEdge* e : v->m_Edges) {
				if (e->m_Used) {
					visit = true;
					break;
				}
			}
			if (!visit) goto següent;
		}

		camiOptim = camiActual;
		costCamiOptim = costCamiActual;
	}

	

	següent:
	for (CEdge* pE : pActual->m_Edges) {

		if (!pE->m_Used && costCamiActual + pE->m_Length < costCamiOptim) {
			
			pE->m_Used = true;

			camiActual.m_Edges.push_back(pE);

			costCamiActual += pE->m_Length;

			backtrackingRec(pE->m_pDestination);

				costCamiActual -= pE->m_Length;
				camiActual.m_Edges.pop_back();
				pE->m_Used = false;
		}
	}
}

CTrack SalesmanTrackBacktracking(CGraph& graph, CVisits& visits)
{
	for (CVertex* vAux : visits.m_Vertices)
		if (vAux != visits.m_Vertices.front() && vAux != visits.m_Vertices.back())
			visites.push_back(vAux);

	CVertex* Inici = visits.m_Vertices.front();
	vDesti = visits.m_Vertices.back();

	camiOptim.Clear();
	camiActual.Clear();

	camiActual.SetGraph(&graph);

	costCamiOptim = DBL_MAX;
	costCamiActual = 0.0;

	for (CEdge& pE : graph.m_Edges)
		pE.m_Used = false;

	backtrackingRec(Inici);

	return camiOptim;
}



// =============================================================================
// SalesmanTrackBacktrackingGreedy =============================================
// =============================================================================


std::vector<std::vector<std::pair<CTrack, double>>> taula_camins_visites;
std::vector<CVertex*> vertices;
std::vector<bool> visited;
std::vector<CTrack*> parts_cami;
std::vector<std::vector<int>> ordre_visites;

void SetupTrackTable(CGraph& graph, CVisits& visits)
{

	visited.resize(visits.m_Vertices.size(), false);
	taula_camins_visites.resize(visits.m_Vertices.size(), std::vector<std::pair<CTrack, double>>());
	ordre_visites.resize(visits.m_Vertices.size(), std::vector<int>());

	int i = 0;
	for (CVertex* origen : visits.m_Vertices)
	{
		vertices.push_back(origen);
		DijkstraQueue(graph, origen);

		taula_camins_visites[i].resize(visits.m_Vertices.size(), std::make_pair(CTrack(&graph), 0.0));
		ordre_visites[i].reserve(visits.m_Vertices.size());

		int j = 0;
		for (CVertex* desti : visits.m_Vertices)
		{
			CTrack cami(&graph);

			CVertex* current = desti;
			while (current != origen)
			{
				cami.AddFirst(current->m_pDijkstraPrevious);
				current = current->m_pDijkstraPrevious->m_pOrigin;
			}

			taula_camins_visites[i][j] = std::make_pair(cami, desti->m_DijkstraDistance);

			j++;
		}

		std::vector<std::pair<int, double>> ordre_valors;
		ordre_valors.reserve(visits.m_Vertices.size());

		int i2 = 0;
		for (std::pair<CTrack, double>& cami : taula_camins_visites[i])
		{
			ordre_valors.push_back(std::make_pair(i2, cami.second));
			i2++;
		}

		std::sort(ordre_valors.begin(), ordre_valors.end(), [](auto& a, auto& b) {
			return a.second < b.second;
			});

		ordre_visites[i].clear();
		for (std::pair<int, double>& t : ordre_valors)
			ordre_visites[i].push_back(t.first);

		i++;
	}
}

void SalesmanTrackBacktrackingGreedyRec(CGraph& graph, CVisits& visits, int from)
{
	if (from == visits.m_Vertices.size() - 1)
	{
		if (std::find(begin(visited), end(visited), false) != end(visited))
			return;


		camiOptim.Clear();
		for (CTrack* part : parts_cami)
			camiOptim.Append(*part);

		costCamiOptim = costCamiActual;

		return;
	}

	for (int i : ordre_visites[from])
	{
		if (visited[i])
			continue;

		if (costCamiActual + taula_camins_visites[from][i].second > costCamiOptim)
			continue;

		visited[i] = true;

		costCamiActual += taula_camins_visites[from][i].second;
		parts_cami.push_back(&taula_camins_visites[from][i].first);

		SalesmanTrackBacktrackingGreedyRec(graph, visits, i);

		parts_cami.pop_back();
		costCamiActual -= taula_camins_visites[from][i].second;

		visited[i] = false;
	}
}

CTrack SalesmanTrackBacktrackingGreedy(CGraph& graph, CVisits& visits)
{
	for (CEdge& pE : graph.m_Edges)
		pE.m_Used = false;

	camiOptim.Clear();
	camiOptim.SetGraph(&graph);

	parts_cami.clear();
	ordre_visites.clear();

	costCamiOptim = numeric_limits<double>::max();
	costCamiActual = 0.0;

	SetupTrackTable(graph, visits);

	SalesmanTrackBacktrackingGreedyRec(graph, visits, 0);

	return camiOptim;
}
